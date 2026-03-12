# Implement CRUD Fixes and Collection Renaming

## Goal Description
The goal is to rename the [Activity](file:///c:/Users/Laksh/OneDrive/Documents/GitHub/Aventara/app/components/AdminPanel.jsx#245-246) and [Hotels](file:///c:/Users/Laksh/OneDrive/Documents/GitHub/Aventara/app/components/AdminPanel.jsx#601-613) collections to lowercase (`activity` and `hotels`), remove unused collections (`rooms`, `amenity_categories`) from the `tours_travel` database, and fix the CRUD logic in the API and UI to ensure full connectivity and synchronization between the Admin Panel and the database.

## Proposed Changes

### Database Setup
#### [NEW] drop_collections.js
- Create a temporary Node.js script to connect to the MongoDB `tours_travel` database and drop the `rooms` and `amenity_categories` collections.

### API Routes
#### [MODIFY] app/api/activities/route.ts
- Change collection references from [Activities](file:///c:/Users/Laksh/OneDrive/Documents/GitHub/Aventara/app/components/AdminPanel.jsx#465-473) to `activity` in GET, POST, PUT, and DELETE handlers.
- Ensure the [PUT](file:///c:/Users/Laksh/OneDrive/Documents/GitHub/Aventara/app/api/hotels/route.ts#71-94) endpoint correctly handles `_id` extraction from the payload and updates the document without altering the `_id` field.

#### [MODIFY] app/api/hotels/route.ts
- Change collection references from [Hotels](file:///c:/Users/Laksh/OneDrive/Documents/GitHub/Aventara/app/components/AdminPanel.jsx#601-613) to `hotels` in GET, POST, PUT, and DELETE handlers.
- **Bug Fix**: Update the [PUT](file:///c:/Users/Laksh/OneDrive/Documents/GitHub/Aventara/app/api/hotels/route.ts#71-94) handler to expect `body._id` instead of `body.id` because the Admin Panel sends `_id`. Ensure `$set` removes `_id` to prevent immutable field errors in MongoDB.

### Frontend
#### [MODIFY] app/components/AdminPanel.jsx
- No major changes needed as long as the API perfectly maps to the shape of data. (The frontend already relies on `_id`).

## Verification Plan
### Automated Tests
- Run the temporary db script `node drop_collections.js` to drop the required collections.
### Manual Verification
1. Open the Admin Panel (`http://localhost:3000`).
2. Add a new Master Activity and ensure it appears.
3. Edit the activity and refresh the page to confirm changes persisted.
4. Delete the activity and ensure it disappears from the Mongo DB.
5. Create, Edit, and Delete a Master Hotel to make sure its API connection functions perfectly.
