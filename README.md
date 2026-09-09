# Jewellery

This repository is a static jewellery catalogue with a Supabase-powered product database and private management page. The public storefront can be hosted, while product names, categories, prices, descriptions, display styles, and product images are managed from the admin page without changing the frontend code.

The `assets/` directory is kept in the repository, but its contents are intentionally ignored by Git. It is reserved for local or private branding and demo images and must be supplied separately when running the project locally. Product images uploaded through the admin panel are stored in Supabase Storage instead of this repository.

## Project purpose and research applications

This project can be used as a small research and learning platform for studying how a static web storefront can be connected to a cloud database and an authenticated content-management workflow. It provides a realistic, focused example without the complexity of a large e-commerce framework or build system.

Possible uses include:

- **Web development education:** Learn how HTML, CSS, and vanilla JavaScript work together in a multi-page application.
- **Database and API research:** Study how a frontend reads and filters records from a Supabase PostgreSQL database.
- **Authentication research:** Explore email/password login, authenticated requests, Row Level Security, and the difference between public and protected operations.
- **Content management research:** Investigate how non-technical users can create, edit, and remove catalogue items through an admin interface.
- **E-commerce prototyping:** Test product categories, price presentation, product imagery, and catalogue organization before building a larger online shop.
- **User-interface and usability studies:** Evaluate navigation, category filters, form design, responsive layouts, and the clarity of product information.
- **Storage and media research:** Examine the trade-offs between local assets, ignored/private files, and public cloud-hosted images.
- **Security research:** Review client-side configuration, public browser keys, Storage permissions, and the risks of allowing every authenticated user to manage products.
- **Deployment research:** Compare local static hosting with GitHub Pages and study how external services support a static frontend.

This repository is best treated as an educational prototype or research reference. It does not currently include checkout, payment processing, order management, inventory synchronization, automated testing, analytics, or a server-side authorization layer. Those features should be designed and reviewed separately before using the project for a production business.

## Features

- Responsive public jewellery catalogue
- Chains, bracelets, earrings, rings, and other product categories
- Category filtering on the storefront
- EUR price formatting
- Supabase email/password authentication for the admin area
- Add, edit, and delete products
- Upload product images to Supabase Storage
- Active/inactive product visibility through the database
- Local demo products when Supabase is not configured
- No build step or package installation required

## Technology

- HTML5 and CSS3
- Vanilla JavaScript
- [Supabase](https://supabase.com/) for authentication, PostgreSQL data, and Storage
- [GitHub Pages](https://pages.github.com/) for static hosting
- Supabase JavaScript client loaded from jsDelivr

## Project structure

```text
saba-jewellery/
├── index.html             # Public storefront
├── admin.html             # Admin login and product dashboard
├── supabase.sql           # Database, RLS, Storage bucket, and policies
├── README.md
├── css/
│   └── style.css          # Storefront and admin styles
├── js/
│   ├── config.js          # Supabase URL and publishable/anon key
│   ├── store.js           # Supabase client, product loading, and EUR formatting
│   ├── shop.js            # Storefront rendering and category filters
│   └── admin.js           # Login, product CRUD, and image uploads
└── assets/                # Directory is tracked; local files inside it are ignored
	└── .gitkeep           # Keeps the directory in the repository
```

## Requirements

- A modern web browser
- A Supabase project for live products and admin features
- Python 3 or another static web server for local development
- Local copies of the required files in `assets/` for the logo and demo fallback images

No Node.js, npm, bundler, or framework is required.

## Supabase setup

### 1. Create the project

Create a project at [supabase.com](https://supabase.com/). From the project dashboard, open **SQL Editor**, create a new query, paste the contents of `supabase.sql`, and run it.

The SQL script creates:

- A `public.products` table
- Row Level Security policies for public active-product reads
- Authenticated product insert, update, and delete policies
- A public `product-images` Storage bucket
- Storage policies for viewing and managing product images

### 2. Create the admin account

In Supabase, open **Authentication > Users** and create an email/password user. Use that account at `admin.html`.

The frontend does not contain a separate admin password. Admin access is provided by Supabase Auth and the database policies.

### 3. Configure the frontend

Open `js/config.js` and set the project URL and publishable/anon key:

```js
window.SUPABASE_URL = "https://your-project-ref.supabase.co";
window.SUPABASE_ANON_KEY = "your-publishable-or-anon-key";
```

The publishable/anon key is intended for browser applications. Never place the Supabase `service_role` key in this repository or any frontend file.

### 4. Verify the setup

Open the storefront and confirm that the product collection loads. Then open `admin.html`, sign in, create a product with an image, and return to the storefront. The new product should appear after the page reloads.

## Product data

Each product uses the following fields:

| Field | Description |
| --- | --- |
| `name` | Product name, required, maximum 120 characters in the form |
| `category` | `Chains`, `Bracelets`, `Earrings`, `Rings`, or `Other` |
| `weight` | Optional weight or product detail, maximum 80 characters |
| `price` | Numeric EUR price; zero is displayed as “Price on request” |
| `description` | Optional description, maximum 500 characters |
| `image_url` | Public URL for the product image |
| `is_active` | Only active products are shown publicly |
| `display_style` | `black`, `white`, or `gold` display style used by the admin view |
| `created_at` / `updated_at` | Timestamps managed by the database |

New products require a JPEG, PNG, or WebP image. When editing a product, selecting a new image replaces the stored image URL; leaving the image field unchanged keeps the current image.

Product image files are uploaded to the public `product-images` Supabase Storage bucket. They are not committed to Git. The `image_url` saved in the database must therefore point to Supabase Storage or another publicly reachable image host.

## Local development

Run a static server from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser. Use the repository root as the server directory so that the relative paths to `css/`, `js/`, and `assets/` work correctly.

Before opening the site locally, add local copies of the files referenced by the HTML and demo fallback data to the existing `assets/` directory, such as `saba-logo.jpeg`, `catalog-bismark.jpeg`, `catalog-valentino.jpeg`, `earrings-clover.jpeg`, and `earrings-cross.jpeg`. The directory is included in a fresh clone, but these files are ignored and must be supplied separately.

If `js/config.js` is not configured, the storefront uses demo product records whose images reference `assets/`. The admin panel remains unavailable. This makes it possible to preview the design without a Supabase project, provided the local asset files exist.

## Deployment with GitHub Pages

1. Commit and push the repository to GitHub.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the deployment branch and the repository root (`/`) as the folder.
5. Save the configuration and wait for GitHub Pages to publish the site.
6. Visit the generated Pages URL and test both `index.html` and `admin.html`.

### Deployment asset requirements

Because files inside `assets/` are ignored, they are not pushed to GitHub Pages. A deployed site will not display the local logo or demo fallback images unless those files are supplied through another deployment process or changed to publicly hosted URLs.

For a live deployment, use Supabase Storage or another approved public image host for product images. If the logo is required on the deployed storefront, host it separately and update the `src` values in `index.html` and `admin.html`. Do not commit private or sensitive media just to make relative paths work.

## Security notes

The public Supabase key is safe to expose in a browser only when Row Level Security policies are configured correctly. The `service_role` key must remain private and must never be committed.

The policies in `supabase.sql` currently allow **any authenticated Supabase user** to insert, update, and delete products and manage product images. For a production shop with more than one user, replace those broad policies with policies tied to an explicit admin role, an allowlisted user ID, or another server-side authorization strategy.

Because the Storage bucket is public, anyone with an image URL can view uploaded product images. Do not upload private or sensitive files. The ignored `assets/` directory helps prevent local/private media from being committed, but it is not an access-control mechanism for files served by a deployed website.

## Troubleshooting

### The storefront shows demo products

Check that `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` in `js/config.js` are correct and that the page is being served over a local web server rather than opened with `file://`. If demo images or the logo are missing, confirm that the local `assets/` directory contains the expected files.

### The collection cannot load

Confirm that `supabase.sql` ran successfully, the `products` table exists, and the public select policy is enabled. Also check the browser developer console for Supabase errors.

### Image upload fails

Confirm that the `product-images` bucket exists, is public, and that the authenticated user has an insert policy on `storage.objects`. The selected file must be JPEG, PNG, or WebP.

### Images are missing after deployment

Files inside `assets/` are not tracked by Git and therefore are not present on GitHub Pages. Host deployed images in Supabase Storage or another public location, then update the relevant image URLs or HTML references.

### Admin login fails

Confirm that the user exists in Supabase Authentication, that the email/password are correct, and that email confirmation requirements are satisfied for the project configuration.

## License

No license has been specified for this repository yet. Add a license file before distributing the project publicly if required.
