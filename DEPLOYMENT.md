# Deployment Instructions

This project uses Cloudflare Pages and Functions for deployment. The backend function requires a Google Cloud Platform (GCP) service account to authenticate with the Vertex AI API.

## Prerequisites

1.  **A GCP Service Account:** You need a GCP service account with the "Vertex AI User" role.
2.  **Service Account Key:** You need a JSON key file for the service account.
3.  **Wrangler CLI:** You need the Wrangler CLI installed and configured.

## Setting the GCP Service Account Secret

To deploy the project, you need to set the `GCP_SERVICE_ACCOUNT` secret in your Cloudflare Pages project. This is a one-time setup.

1.  **Set the Secret:**

    Run the following command. It will prompt you to paste the **entire content** of your service account JSON key file.

    ```bash
    npx wrangler secret put GCP_SERVICE_ACCOUNT
    ```

2.  **Deploy the Project:**

    ```bash
    npm run deploy
    ```
