#!/usr/bin/env python3
"""
Script to delete all vectors in a specific Pinecone namespace.
This is useful for clearing old embeddings before re-uploading with comprehensive data.
"""

import os
import sys
import argparse
from pinecone import Pinecone
from app.core.config import settings

def delete_namespace_vectors(namespace: str, confirm: bool = False):
    """
    Delete all vectors in a specific Pinecone namespace.
    
    Args:
        namespace: The namespace to clear
        confirm: Whether to skip confirmation prompt
    """
    
    # Initialize Pinecone client
    if not settings.PINECONE_API_KEY:
        print("❌ Error: PINECONE_API_KEY not found in environment variables")
        return False
        
    try:
        pinecone_client = Pinecone(api_key=settings.PINECONE_API_KEY)
        index = pinecone_client.Index(settings.PINECONE_INDEX_NAME)
        print(f"✅ Connected to Pinecone index: {settings.PINECONE_INDEX_NAME}")
    except Exception as e:
        print(f"❌ Error connecting to Pinecone: {e}")
        return False
    
    # Get namespace stats first
    try:
        stats = index.describe_index_stats()
        namespace_stats = stats.namespaces.get(namespace, None)
        
        if not namespace_stats:
            print(f"⚠️  Namespace '{namespace}' not found or is empty")
            return True
            
        vector_count = namespace_stats.vector_count
        print(f"📊 Found {vector_count} vectors in namespace '{namespace}'")
        
    except Exception as e:
        print(f"❌ Error getting namespace stats: {e}")
        return False
    
    # Confirmation prompt
    if not confirm:
        print(f"\n⚠️  WARNING: This will permanently delete ALL {vector_count} vectors in namespace '{namespace}'")
        response = input("Are you sure you want to continue? (yes/no): ").lower().strip()
        
        if response not in ['yes', 'y']:
            print("❌ Operation cancelled")
            return False
    
    # Delete all vectors in the namespace
    try:
        print(f"🗑️  Deleting all vectors in namespace '{namespace}'...")
        
        # Delete all vectors in the namespace
        index.delete(delete_all=True, namespace=namespace)
        
        print(f"✅ Successfully deleted all vectors in namespace '{namespace}'")
        
        # Verify deletion
        try:
            stats_after = index.describe_index_stats()
            namespace_stats_after = stats_after.namespaces.get(namespace, None)
            
            if not namespace_stats_after or namespace_stats_after.vector_count == 0:
                print(f"✅ Verification: Namespace '{namespace}' is now empty")
            else:
                print(f"⚠️  Warning: {namespace_stats_after.vector_count} vectors still remain")
                
        except Exception as e:
            print(f"⚠️  Could not verify deletion: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error deleting vectors: {e}")
        return False

def list_namespaces():
    """List all namespaces in the Pinecone index."""
    
    if not settings.PINECONE_API_KEY:
        print("❌ Error: PINECONE_API_KEY not found in environment variables")
        return False
        
    try:
        pinecone_client = Pinecone(api_key=settings.PINECONE_API_KEY)
        index = pinecone_client.Index(settings.PINECONE_INDEX_NAME)
        
        stats = index.describe_index_stats()
        
        if not stats.namespaces:
            print("📭 No namespaces found in the index")
            return True
            
        print(f"📋 Namespaces in index '{settings.PINECONE_INDEX_NAME}':")
        print("-" * 60)
        
        for namespace, namespace_stats in stats.namespaces.items():
            print(f"  {namespace}: {namespace_stats.vector_count} vectors")
            
        print("-" * 60)
        print(f"Total namespaces: {len(stats.namespaces)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error listing namespaces: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(
        description="Delete all vectors in a Pinecone namespace",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python delete_pinecone_namespace.py --list
  python delete_pinecone_namespace.py --namespace user123
  python delete_pinecone_namespace.py --namespace user123 --confirm
        """
    )
    
    parser.add_argument(
        "--namespace", 
        type=str, 
        help="Namespace to delete (user ID)"
    )
    
    parser.add_argument(
        "--list", 
        action="store_true", 
        help="List all namespaces and their vector counts"
    )
    
    parser.add_argument(
        "--confirm", 
        action="store_true", 
        help="Skip confirmation prompt"
    )
    
    args = parser.parse_args()
    
    if args.list:
        success = list_namespaces()
        sys.exit(0 if success else 1)
    
    if not args.namespace:
        print("❌ Error: --namespace is required (or use --list to see available namespaces)")
        parser.print_help()
        sys.exit(1)
    
    print(f"🚀 Starting deletion process for namespace: {args.namespace}")
    success = delete_namespace_vectors(args.namespace, args.confirm)
    
    if success:
        print(f"✅ Process completed successfully")
        sys.exit(0)
    else:
        print(f"❌ Process failed")
        sys.exit(1)

if __name__ == "__main__":
    main()