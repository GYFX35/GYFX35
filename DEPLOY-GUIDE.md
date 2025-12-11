# Deployment Guide

This guide provides instructions on how to deploy this static website to various cloud providers.

## General Steps

1.  **Build the website:** Since this is a static website, there is no build step. The `index.html`, `style.css`, and `script.js` files are ready to be deployed.
2.  **Choose a cloud provider:** There are many cloud providers that offer static website hosting. Some popular options include:
    *   [Netlify](https'://www.netlify.com/)
    *   [Vercel](https://vercel.com/)
    *   [GitHub Pages](https://pages.github.com/)
    *   [Amazon S3](https://aws.amazon.com/s3/)
    *   [Google Cloud Storage](https://cloud.google.com/storage/)
    *   [Tencent Cloud Object Storage (COS)](https://intl.cloud.tencent.com/product/cos)

## Deploying to Tencent Cloud Object Storage (COS)

1.  **Create a Tencent Cloud account:** If you don't already have one, sign up for a Tencent Cloud account.
2.  **Create a COS bucket:**
    *   Go to the [Tencent Cloud Console](https://console.cloud.tencent.com/).
    *   Navigate to the **Cloud Object Storage** service.
    *   Click **Create Bucket**.
    *   Enter a unique bucket name, choose a region, and set the access permissions to **Public Read/Private Write**.
3.  **Upload the website files:**
    *   Open the newly created bucket.
    *   Click **Upload Files**.
    *   Select the `index.html`, `style.css`, `script.js`, and `LICENSE` files.
    *   Click **Upload**.
4.  **Enable static website hosting:**
    *   In the bucket settings, go to the **Basic Configurations** > **Static Website** tab.
    *   Enable static website hosting.
    *   Set the **Index document** to `index.html`.
    *   Click **Save**.
5.  **Access your website:**
    *   Go to the **Overview** tab of your bucket.
    *   You will find the **Endpoint** URL for your website.
    *   You can now access your website at this URL.
