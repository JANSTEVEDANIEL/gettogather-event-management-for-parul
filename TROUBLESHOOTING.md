# Gettogather - Supabase Troubleshooting Guide

This guide will help you resolve common issues related to Supabase configuration.

## Issue: "Broken Link" or "Redirect URL Mismatch" on Google Sign-in

This is the most common issue and is caused by settings in your Supabase dashboard not matching your application's URL.

**To fix this, you MUST perform the following steps:**

### Step 1: Set Your Site URL

1.  Go to your Supabase Project.
2.  In the left sidebar, click the **Authentication** icon (a key).
3.  In the **Configuration** section, click on **URL Configuration**.
4.  In the **Site URL** field, enter the URL of your deployed application. For local development, this is typically `http://localhost:5173`.
5.  Click **Save**.



### Step 2: Add Your Redirect URL

This is the most critical step.

1.  While still in the **URL Configuration** page, find the **Redirect URLs** section.
2.  You need to add the following URL to the list:
    ```
    http://localhost:5173/auth/callback
    ```
3.  If you have a deployed version of the app (e.g., on Netlify), you must also add its callback URL. For example:
    ```
    https://your-app-name.netlify.app/auth/callback
    ```
4.  Click **Save**.

**IMPORTANT:** The URL must be an **exact match**. Any small difference (like `http` vs `httpss` or a missing trailing slash) will cause the login to fail.



### Step 3: Change Project Name (Optional but Recommended)

To make the Google sign-in screen look professional, you should change the name it displays.

1.  In the left sidebar, click the **Project Settings** icon (a gear).
2.  Go to the **General** tab.
3.  Change the **Project Name** to `Gettogather`.
4.  Click **Save**.

This will change the message from "Sign in to apgnxhxadzyiawzncwyi.supabase.co" to "Sign in to Gettogather".

After completing these 3 steps, your Google Authentication will work correctly.
