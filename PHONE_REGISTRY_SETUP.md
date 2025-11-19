# Phone Registry API Configuration

This document explains how to configure the Check API integration for phone number registry management.

## Configuration Steps

### 1. Run Database Migrations

First, apply the database migrations to create the necessary tables:

```bash
cd backend
python manage.py migrate
```

### 2. Access Django Admin Panel

1. Start your Django server (if not already running):
   ```bash
   python manage.py runserver
   ```

2. Open your browser and navigate to the Django admin panel:
   ```
   http://localhost:8000/admin/
   ```
   (or your production URL: `https://yourdomain.com/admin/`)

3. Log in with a superuser account

### 3. Configure Check API

1. In the Django admin panel, look for **"Phone Registry"** section in the left sidebar

2. Click on **"Check API Configurations"**

3. Click **"Add Check API Configuration"** button (top right)

4. Fill in the configuration:
   - **Name**: `default` (or any name you prefer)
   - **API Key**: Enter your Check API key (e.g., `your-api-key-here`)
   - **Base URL**: Enter the Check API base URL (e.g., `http://checkapi.org`)
   - **Is Active**: ✓ (checked)

5. Click **"Save"**

### 4. Verify Configuration

The API is now configured. Admin users can access the phone registry features:
- `/dashboard/phone-check` - Check phone numbers
- `/dashboard/phone-register` - Register phones
- `/dashboard/phone-bulk` - Bulk register
- `/dashboard/phone-list` - View registry
- `/dashboard/phone-analytics` - View analytics
- `/dashboard/spam-analyzer` - Analyze spam messages

## Configuration Fields Explained

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Unique identifier for this configuration | `default`, `production`, `staging` |
| **API Key** | Your Check API authentication key | `sk_live_abc123xyz456...` |
| **Base URL** | The base URL of the Check API service | `http://checkapi.org` or `https://api.checkservice.com` |
| **Is Active** | Whether this configuration is currently in use | ✓ (only one should be active) |

## Multiple Configurations

You can create multiple configurations (e.g., for development, staging, production), but only one should be marked as **Active** at a time. The system will use the active configuration for all API requests.

## Security Notes

- ⚠️ Keep your API key secure and never commit it to version control
- ⚠️ Only admin users (with `is_staff=True` or `is_superuser=True`) can access phone registry features
- ⚠️ All phone registry API endpoints require admin authentication

## Troubleshooting

### "No active API configuration found" Error

This error occurs when:
1. No Check API Configuration exists in the database
2. No configuration is marked as "Active"

**Solution**: Create a configuration in Django admin and ensure "Is Active" is checked.

### Connection Errors

If you see connection errors:
1. Verify the Base URL is correct and accessible
2. Check that your API key is valid
3. Ensure your server can reach the Check API service (check firewall/network settings)

## Environment Variables (Optional)

For production deployments, you may want to store sensitive values in environment variables:

```python
# In settings.py or configuration
CHECK_API_KEY = os.environ.get('CHECK_API_KEY')
CHECK_API_BASE_URL = os.environ.get('CHECK_API_BASE_URL', 'http://checkapi.org')
```

Then create the configuration programmatically or via Django admin.
