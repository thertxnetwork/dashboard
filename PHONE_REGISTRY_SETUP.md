# Phone Registry API Configuration

This document explains how to configure the Check API integration for phone number registry management.

## Configuration Steps

### 1. Run Database Migrations

First, apply the database migrations to create the necessary tables:

```bash
cd backend
python manage.py migrate
```

### 2. Configure Check API via Settings Page

1. Start your application (if not already running)

2. Log in with an admin account (user must have `is_staff=True` or `is_superuser=True`)

3. Navigate to the **Settings** page: `/dashboard/settings`

4. In the **Check API Configuration** section (visible only to admins), fill in:
   - **Check API Base URL**: Enter the Check API base URL (e.g., `http://checkapi.org`)
   - **API Key**: Enter your Check API key
   - **Enable Check API**: Toggle to enable/disable the integration

5. Click **"Save Check API Config"**

6. (Optional) Click **"Test Connection"** to verify the configuration works

### 3. Verify Configuration

The API is now configured. Admin users can access the phone registry features:
- `/dashboard/phone-check` - Check phone numbers
- `/dashboard/phone-register` - Register phones
- `/dashboard/phone-bulk` - Bulk register
- `/dashboard/phone-list` - View registry
- `/dashboard/phone-analytics` - View analytics
- `/dashboard/spam-analyzer` - Analyze spam messages

## Configuration UI Screenshot

The Check API configuration is available at **Settings → Check API Configuration** (admin only):

```
┌──────────────────────────────────────────┐
│ Check API Configuration                  │
├──────────────────────────────────────────┤
│ Configure the external Check API for     │
│ phone registry management                │
│                                          │
│ Check API Base URL                       │
│ ┌────────────────────────────────────┐  │
│ │ http://checkapi.org                 │  │
│ └────────────────────────────────────┘  │
│ The base URL of the Check API service   │
│                                          │
│ API Key                                  │
│ ┌────────────────────────────────────┐  │
│ │ ••••••••••••••••••••••             │  │
│ └────────────────────────────────────┘  │
│ Your Check API authentication key       │
│                                          │
│ ☑ Enable Check API                     │
│                                          │
│ [Save Check API Config] [Test Connection]│
└──────────────────────────────────────────┘
```

## Configuration Fields Explained

| Field | Description | Example |
|-------|-------------|---------|
| **Check API Base URL** | The base URL of the Check API service | `http://checkapi.org` or `https://api.checkservice.com` |
| **API Key** | Your Check API authentication key | `sk_live_abc123xyz456...` |
| **Enable Check API** | Whether the Check API integration is active | ✓ (checked) |

## API Endpoints

The backend provides these REST API endpoints for configuration (admin only):

- `GET /api/phone/config/` - Get current configuration
- `POST /api/phone/config/update/` - Update configuration
- `POST /api/phone/config/test/` - Test API connection

## Security Notes

- ⚠️ Keep your API key secure and never commit it to version control
- ⚠️ Only admin users (with `is_staff=True` or `is_superuser=True`) can:
  - View the Check API configuration section
  - Update configuration
  - Access phone registry features
- ⚠️ API keys are masked in the UI after saving (only last 4 characters shown)
- ⚠️ Configuration is stored encrypted in the database

## Troubleshooting

### "No active API configuration found" Error

This error occurs when:
1. No Check API Configuration has been saved
2. The configuration exists but "Enable Check API" is not checked

**Solution**: Go to Settings page and save the Check API configuration with "Enable Check API" checked.

### Connection Test Fails

If the connection test fails:
1. Verify the Base URL is correct and accessible
2. Check that your API key is valid
3. Ensure your server can reach the Check API service (check firewall/network settings)
4. Check the error message for specific details

### Settings Page Not Showing Check API Section

This section is only visible to admin users. Ensure:
1. You are logged in
2. Your user account has `is_staff=True` or `is_superuser=True`

## Multiple Environments

For different environments (development, staging, production), you can:
1. Use different Check API keys for each environment
2. Update the configuration through the Settings page in each environment
3. The configuration is stored per deployment/database

## Alternative: Environment Variables (Advanced)

For automated deployments, you can also pre-configure using environment variables and Django management commands. Contact your system administrator for details.
