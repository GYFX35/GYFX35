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

## Tencent Cloud COS Deployment

This project can also be deployed to Tencent Cloud Object Storage (COS) for static website hosting.

### Prerequisites

1.  **Tencent Cloud Account:** You need a Tencent Cloud account.
2.  **COS Bucket:** You need to create a COS bucket and configure it for static website hosting.
3.  **API Keys:** You need a `SecretId` and `SecretKey` from the Tencent Cloud API Key Management console.

### Setting up GitHub Secrets

To enable the deployment workflow, you need to add the following secrets to your GitHub repository settings under `Settings > Secrets and variables > Actions`:

*   `TENCENT_CLOUD_SECRET_ID`: Your Tencent Cloud API Secret ID.
*   `TENCENT_CLOUD_SECRET_KEY`: Your Tencent Cloud API Secret Key.
*   `COS_BUCKET`: The name of your COS bucket.
*   `COS_REGION`: The region of your COS bucket (e.g., `ap-guangzhou`).

Once these secrets are configured, the deployment will automatically run on every push to the `main` branch.
