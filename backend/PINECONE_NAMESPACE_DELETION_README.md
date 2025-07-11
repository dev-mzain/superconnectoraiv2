# Pinecone Namespace Deletion Script

## Overview
This script allows you to delete all vectors in a specific Pinecone namespace. This is particularly useful when you want to clear old embeddings before re-uploading data with the new comprehensive embedding format.

## Usage

### List All Namespaces
To see all available namespaces and their vector counts:
```bash
python3 delete_pinecone_namespace.py --list
```

### Delete a Specific Namespace
To delete all vectors in a specific namespace (with confirmation prompt):
```bash
python3 delete_pinecone_namespace.py --namespace <user_id>
```

### Delete Without Confirmation
To delete without the confirmation prompt (useful for scripts):
```bash
python3 delete_pinecone_namespace.py --namespace <user_id> --confirm
```

## Examples

### Example 1: List namespaces
```bash
$ python3 delete_pinecone_namespace.py --list
📋 Namespaces in index 'profile-embeddings':
------------------------------------------------------------
  21ebf4af-b3e5-49bd-a077-276c74e0d914: 5100 vectors
  d2e7bb46-bf48-4384-b3a7-fb1c6f751279: 8100 vectors
  170a87b1-f462-43e9-a3ac-33b635b7475b: 1000 vectors
------------------------------------------------------------
Total namespaces: 3
```

### Example 2: Delete a namespace with confirmation
```bash
$ python3 delete_pinecone_namespace.py --namespace 170a87b1-f462-43e9-a3ac-33b635b7475b
🚀 Starting deletion process for namespace: 170a87b1-f462-43e9-a3ac-33b635b7475b
✅ Connected to Pinecone index: profile-embeddings
📊 Found 1000 vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'

⚠️  WARNING: This will permanently delete ALL 1000 vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'
Are you sure you want to continue? (yes/no): yes
🗑️  Deleting all vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'...
✅ Successfully deleted all vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'
✅ Verification: Namespace '170a87b1-f462-43e9-a3ac-33b635b7475b' is now empty
✅ Process completed successfully
```

### Example 3: Delete without confirmation (for automation)
```bash
$ python3 delete_pinecone_namespace.py --namespace 170a87b1-f462-43e9-a3ac-33b635b7475b --confirm
🚀 Starting deletion process for namespace: 170a87b1-f462-43e9-a3ac-33b635b7475b
✅ Connected to Pinecone index: profile-embeddings
📊 Found 1000 vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'
🗑️  Deleting all vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'...
✅ Successfully deleted all vectors in namespace '170a87b1-f462-43e9-a3ac-33b635b7475b'
✅ Verification: Namespace '170a87b1-f462-43e9-a3ac-33b635b7475b' is now empty
✅ Process completed successfully
```

## Use Cases

### 1. Upgrading to Comprehensive Embeddings
When upgrading from the old limited embedding format to the new comprehensive format:
```bash
# 1. List current namespaces
python3 delete_pinecone_namespace.py --list

# 2. Delete old embeddings for a user
python3 delete_pinecone_namespace.py --namespace <user_id> --confirm

# 3. Re-upload CSV with new comprehensive embeddings
# (User uploads CSV through the web interface)
```

### 2. Clearing Test Data
For development and testing:
```bash
# Clear test user data
python3 delete_pinecone_namespace.py --namespace test-user-123 --confirm
```

### 3. User Data Cleanup
When a user wants to start fresh:
```bash
# Clear all embeddings for a specific user
python3 delete_pinecone_namespace.py --namespace <user_id>
```

## Safety Features

### 1. Confirmation Prompt
By default, the script requires explicit confirmation before deletion:
- Shows the exact number of vectors to be deleted
- Requires typing "yes" to proceed
- Can be bypassed with `--confirm` flag for automation

### 2. Verification
After deletion, the script verifies that the namespace is empty:
- Checks vector count after deletion
- Reports success or any remaining vectors

### 3. Error Handling
- Validates Pinecone connection before proceeding
- Handles missing namespaces gracefully
- Provides clear error messages

## Requirements

### Environment Variables
- `PINECONE_API_KEY`: Your Pinecone API key
- `PINECONE_INDEX_NAME`: Your Pinecone index name

### Dependencies
- `pinecone-client`: Pinecone Python client
- `app.core.config`: Application configuration

## Important Notes

### ⚠️ Data Loss Warning
- **This operation is irreversible**
- **All vectors in the specified namespace will be permanently deleted**
- **Always double-check the namespace before confirming deletion**

### 🔄 Namespace vs User ID
- Each user has their own namespace in Pinecone
- The namespace is typically the user's UUID
- Use `--list` to see all available namespaces

### 🚀 Performance
- Deletion is typically fast (a few seconds)
- Large namespaces (10k+ vectors) may take longer
- The script provides progress feedback

## Troubleshooting

### Connection Issues
```
❌ Error: PINECONE_API_KEY not found in environment variables
```
**Solution:** Ensure your `.env` file contains the correct Pinecone API key.

### Namespace Not Found
```
⚠️  Namespace 'user123' not found or is empty
```
**Solution:** Use `--list` to see available namespaces, or the namespace is already empty.

### Permission Issues
```
❌ Error deleting vectors: Unauthorized
```
**Solution:** Check that your Pinecone API key has the correct permissions.