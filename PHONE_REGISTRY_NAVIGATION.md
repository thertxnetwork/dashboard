# Phone Registry Features - Navigation Guide

## Sidebar Menu Location

All Phone Registry features are accessible from the **sidebar menu** in the dashboard. When logged in as an admin user (with `is_staff=True` or `is_superuser=True`), you'll see 6 additional menu items at the bottom of the sidebar:

## Phone Registry Menu Items

### 1. 🔍 **Phone Check** → `/dashboard/phone-check`
Check if a phone number exists in the registry and view its details.

**Features:**
- Search by phone number
- View registration date, botname, country, ISO2 code
- See quality level and 2FA status
- Check if bulk registered or individual
- Display session string (masked)

---

### 2. ➕ **Phone Register** → `/dashboard/phone-register`
Register a single phone number with complete metadata.

**Features:**
- Form with all required fields
- Phone number (max 20 chars)
- Bot name (max 100 chars)
- Country and ISO2 code
- 2FA password (4-1000 chars)
- Session string (max 10000 chars)
- Optional quality field
- Form validation and error handling

---

### 3. 👥 **Phone Bulk** → `/dashboard/phone-bulk`
Register multiple phone numbers in bulk (up to 1000 per request).

**Features:**
- Textarea for entering phone numbers (one per line)
- Live count of entered numbers
- Bulk registration with is_bulked=TRUE
- Results breakdown:
  - Total submitted
  - Newly registered
  - Already exists
  - Failed
- Clear results display

---

### 4. 📋 **Phone List** → `/dashboard/phone-list`
Browse and filter all registered phone numbers with pagination.

**Features:**
- Collapsible advanced filter panel
- Filter by:
  - Bot name
  - Country
  - ISO2 code
  - Quality level
  - Bulk status (bulked/individual)
- Sort by multiple fields (date, phone, country, botname, quality)
- Sort direction (ascending/descending)
- Pagination (10-1000 records per page)
- Total count display
- Table view with all details

---

### 5. 📊 **Phone Analytics** → `/dashboard/phone-analytics`
View statistics and analytics for phone number registry.

**Features:**
- Date range filtering (start date, end date)
- Bulk status filter
- Statistics cards:
  - Total count
  - Bulked count
  - Individual count
- Breakdown by country (with counts)
- Breakdown by botname (with counts)
- Breakdown by quality level (with counts)
- 2FA status (enabled/disabled counts)
- Oldest and newest registration dates

---

### 6. ⚠️ **Spam Analyzer** → `/dashboard/spam-analyzer`
Analyze account status messages using multilingual NLP detection.

**Features:**
- Text area for message input
- Multilingual language detection
- Account status classification:
  - Free (no limits)
  - Limited (messaging restrictions)
  - Registered (phone number restrictions)
  - Frozen (blocked/banned)
- Analysis results:
  - Detected language
  - Translated text
  - Indicators found (count for each status)
  - Template similarities (percentage match)
  - Sentiment polarity
  - Message length (word count)
  - Confidence level (high/medium/low)

---

## Sidebar Structure (Admin View)

```
┌─────────────────────────────────┐
│ 🏠 Dashboard                    │
│ 👥 Users                        │
│ 💾 Database                     │
│ 📄 Reports                      │
│ 🔔 Notifications                │
│ 🛡️  Security                    │
│ 📊 Monitoring                   │
│ ⚙️  Settings                    │
│                                 │
│ ──── PHONE REGISTRY (Admin) ────│
│ 🔍 Phone Check                  │
│ ➕ Phone Register               │
│ 👥 Phone Bulk                   │
│ 📋 Phone List                   │
│ 📊 Phone Analytics              │
│ ⚠️  Spam Analyzer               │
└─────────────────────────────────┘
```

## Access Control

**Admin Only** (requires `is_staff=True` or `is_superuser=True`):
- All Phone Registry menu items are hidden for regular users
- Only admin users will see these 6 additional menu items
- Direct URL access is also blocked by backend authentication

**Regular Users** (non-admin):
- Will NOT see Phone Registry menu items
- Can still access standard dashboard features
- Attempting to access Phone Registry URLs directly will result in 403 Forbidden

## Configuration

Before using Phone Registry features, configure the Check API:

1. Go to **Settings** (`/dashboard/settings`)
2. Find **Check API Configuration** section (admin only)
3. Enter:
   - Check API Base URL (e.g., `http://checkapi.org`)
   - API Key
   - Toggle "Enable Check API"
4. Click **Save Check API Config**
5. (Optional) Click **Test Connection** to verify

## Implementation Details

- **Location:** `frontend/src/components/layout/DashboardLayout.tsx` (lines 78-83)
- **Filtering:** Admin-only items are filtered based on user role (line 88)
- **Icons:** Each menu item has appropriate Lucide React icons
- **Pages:** All pages are in `frontend/src/app/dashboard/[page-name]/page.tsx`
- **Responsive:** Works on mobile, tablet, and desktop
- **Consistent Design:** All pages use MUI v7 compatible Box-based layouts

## All Pages Are Live and Functional

✅ All 6 Phone Registry pages are created  
✅ All pages are linked in the sidebar  
✅ Navigation is working correctly  
✅ Admin-only filtering is active  
✅ All pages have proper error handling  
✅ Loading states implemented  
✅ Form validation on input pages  
✅ Responsive design for all screen sizes  

## Quick Links

- **Phone Check:** [/dashboard/phone-check](/dashboard/phone-check)
- **Phone Register:** [/dashboard/phone-register](/dashboard/phone-register)
- **Phone Bulk:** [/dashboard/phone-bulk](/dashboard/phone-bulk)
- **Phone List:** [/dashboard/phone-list](/dashboard/phone-list)
- **Phone Analytics:** [/dashboard/phone-analytics](/dashboard/phone-analytics)
- **Spam Analyzer:** [/dashboard/spam-analyzer](/dashboard/spam-analyzer)
- **Settings (Config):** [/dashboard/settings](/dashboard/settings)
