# 🏢 Data Center Infrastructure Management (DCIM) via GitHub

This repository tracks physical hardware assets for **Dell** and **HPE** fleets across data centers using GitHub Issues and Project Boards.

## 🛠️ Operational Instructions

1. **Adding Hardware manually:** Go to the "Issues" tab, click **New Issue**, and select the **Data Center Asset** template form. Fill out all the required physical fields (RU rack numbers, serial tags).
2. **Updating Details:** All updates to technical configurations (like RAM or IP changes) must be done through the **Project View Grid/Columns** interface. Do not modify raw issue text fields.
3. **Decommissioning:** Move an asset's project status column to `Decommissioned` to automatically archive the device and close its corresponding issue tracker.

## 🔒 Security Restrictions
* Only users explicitly defined in the administrative policy can modify the **IP Address** custom field.
* Unauthorized alterations will automatically be rolled back via an active GitHub Actions workflow and logged for auditing
