# ZingIQ

A business intelligence platform for small businesses, built with React, shadcn-admin-kit, and Supabase.

ZingIQ helps small business owners manage customer relationships, track deals, and make data-driven decisions to grow their business.

## Features

- 📇 **Organize Contacts**: Keep all your contacts in one easily accessible place.
- ⏰ **Create Tasks & Set Reminders**: Never miss a follow-up or deadline.
- 📝 **Take Notes**: Capture important details and insights effortlessly.
- ✉️ **Capture Emails**: CC ZingIQ to automatically save communications as notes.
- 📊 **Manage Deals**: Visualize and track your sales pipeline in a Kanban board.
- 📈 **Analytics Dashboard**: View customer behavior and business intelligence insights.
- 🔄 **Import & Export Data**: Easily transfer contacts in and out of the system.
- 🔐 **Control Access**: Log in with Google, Azure, Keycloak, and Auth0.
- 📜 **Track Activity History**: View all interactions in aggregated activity logs.
- 🔗 **Integrate via API**: Connect seamlessly with other systems using our API.
- 🛠️ **Customize Everything**: Add custom fields, change the theme, and replace any component to fit your needs.

## Installation

To run this project locally, you will need the following tools installed on your computer:

- Make
- Node 22 LTS
- Docker (required by Supabase)

Clone the repository:

```sh
git clone https://github.com/your-org/zingiq.git
```

Install dependencies:

```sh
cd zingiq
make install
```

This will install the dependencies for the frontend and the backend, including a local Supabase instance.

Once your app is configured, start the app locally with the following command:

```sh
make start
```

This will start the Vite dev server for the frontend, the local Supabase instance for the API, and a Postgres database (thanks to Docker).

You can then access the app via [http://localhost:5173/](http://localhost:5173/). You will be prompted to create the first user.

If you need to debug the backend, you can access the following services:

- Supabase dashboard: [http://localhost:54323/](http://localhost:54323/)
- REST API: [http://127.0.0.1:54321](http://127.0.0.1:54321)
- Attachments storage: [http://localhost:54323/project/default/storage/buckets/attachments](http://localhost:54323/project/default/storage/buckets/attachments)
- Inbucket email testing service: [http://localhost:54324/](http://localhost:54324/)

## User Documentation

1. [User Management](./doc/src/content/docs/users/user-management.mdx)
2. [Importing And Exporting Data](./doc/src/content/docs/users/import-contacts.mdx)
3. [Inbound Email](./doc/src/content/docs/users/inbound-email.mdx)

## Deploying to Production

1. [Configuring Supabase](./doc/src/content/docs/developers/supabase-configuration.mdx)
2. [Configuring Inbound Email](./doc/src/content/docs/developers/inbound-email-configuration.mdx) *(optional)*
3. [Deployment](./doc/src/content/docs/developers/deploy.mdx)

## Customizing ZingIQ

To customize ZingIQ, you will need TypeScript and React programming skills as there is no graphical user interface for customization. Here are some resources to assist you in getting started.

1. [Customizing the CRM](./doc/src/content/docs/developers/customizing.mdx)
2. [Creating Migrations](./doc/src/content/docs/developers/migrations.mdx) *(optional)*
3. [Using Fake Rest Data Provider for Development](./doc/src/content/docs/developers/data-providers.mdx) *(optional)*
4. [Architecture Decisions](./doc/src/content/docs/developers/architecture-choices.mdx) *(optional)*

## Testing Changes

This project contains unit tests. Run them with the following command:

```sh
make test
```

You can add your own unit tests powered by Vitest anywhere in the `src` directory. The test files should be named `*.test.tsx` or `*.test.ts`.

## License

This project is built on top of [Atomic CRM](https://github.com/marmelab/atomic-crm) by Marmelab, licensed under the MIT License.
