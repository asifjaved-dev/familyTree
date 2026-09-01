# Family Chart — Laravel + Inertia.js

A modern and interactive **Family Tree / Family Chart web application** built with **Laravel, Inertia.js, and Family Chart.js**.

The application allows users to create, manage, and visualize family relationships through an interactive family tree interface.

## ✨ Features

### Family Tree

* Interactive family tree visualization
* Parent / child relationships
* Spouse relationships
* Sibling relationships
* Multiple generations
* Zoom and pan support
* Expand and collapse family branches
* Responsive family tree layout
* Profile cards for family members
* Print Family Tree
  

### Family Member Management

* Create family members
* Edit family member information
* Delete family members
* Add profile photos
* Date of birth
* Date of death
* Gender

### Relationship Management

* Add parents
* Add children
* Add spouse
* Add siblings
* Support multiple marriages
* Support complex family relationships
* Relationship validation

### Interactive Chart

Powered by **Family Chart.js**.

* Drag family members
* Zoom in / out
* Pan around the chart
* Search family members
* Focus on a specific person
* Navigate between generations
* Dynamic chart updates

## 🚀 Planned Features

The project is being enhanced with additional family-management features.

### 👤 Advanced Profiles

* Profile timeline
* Education history
* Employment history
* Places lived
* Social media profiles
* Personal website
* Profile pictures

### 📅 Family Events

* Birthdays
* Weddings
* Anniversaries
* Death anniversaries
* Family reunions
* Custom family events
* Event reminders

### 🌳 Advanced Family Tree

* Multiple family trees
* Separate branches
* Ancestor view
* Descendant view
* Couple view
* Pedigree view
* Generation filtering
* Relationship path finder

### 🔎 Search & Navigation

* Search by name
* Search by date
* Search by location
* Search by occupation
* Advanced filters
* Quick member navigation
* Find relationship between two members

### 📊 Family Statistics

* Total family members
* Number of generations
* Male / female distribution
* Living / deceased members
* Average age
* Family branches
* Geographic distribution

### 📍 Location

* Birthplace
* Current location
* Previous locations
* Family migration history
* Map-based family visualization

### 🔐 Authentication & Permissions

* User registration
* Login / logout
* Password reset
* Email verification
* Private family trees
* Public family trees
* Family administrator
* Member permissions
* View-only users

### 📤 Import & Export

* Import family data
* Export family tree
* JSON export
* CSV import/export
* GEDCOM support
* PDF family tree
* Family chart image export

### 🤝 Collaboration

* Invite family members
* Shared family tree
* Member contributions
* Activity history
* Change tracking
* Approval workflow for changes

### 🔔 Notifications

* Birthday reminders
* Anniversary reminders
* New family member notifications
* Relationship updates
* Family event notifications

## 🛠️ Tech Stack

### Backend

* PHP
* Laravel
* MySQL / PostgreSQL
* Laravel Eloquent ORM

### Frontend

* Vue.js
* Inertia.js
* JavaScript
* Family Chart.js
* Tailwind CSS

### Development Tools

* Composer
* NPM
* Vite
* Git

## 📋 Requirements

Before installing the project, make sure you have:

* PHP 8.2+
* Composer
* Node.js 20+
* NPM
* MySQL / PostgreSQL
* Laravel 11+

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/family-chart.git

cd family-chart
```

Install PHP dependencies:

```bash
composer install
```

Install frontend dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure your database inside `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=family_chart
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

If the project contains seeders:

```bash
php artisan db:seed
```

Start Laravel:

```bash
php artisan serve
```

Start Vite:

```bash
npm run dev
```

The application will be available at:

```text
http://127.0.0.1:8000
```

## 🗂️ Project Structure

```text
family-chart/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Requests/
│   │
│   ├── Models/
│   │   └── FamilyMember.php
│   │
│   └── Services/
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   ├── Pages/
│   │   └── Layouts/
│   │
│   └── css/
│
├── routes/
│   └── web.php
│
├── public/
│
├── package.json
├── composer.json
└── README.md
```

## 🧩 Architecture

The application follows a modern Laravel + Inertia architecture:

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │      Vue.js UI      │
                    └──────────┬──────────┘
                               │
                               │ Inertia.js
                               ▼
                    ┌─────────────────────┐
                    │       Laravel       │
                    │    Controllers      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │   Business Logic    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    │   MySQL/PostgreSQL  │
                    └─────────────────────┘

                               │
                               ▼

                    ┌─────────────────────┐
                    │ Family Chart.js     │
                    │ Interactive Tree    │
                    └─────────────────────┘
```

## 🧑‍💻 Development

Run the Laravel development server:

```bash
php artisan serve
```

Run Vite:

```bash
npm run dev
```

For production:

```bash
npm run build
```

## 🧪 Testing

Run Laravel tests:

```bash
php artisan test
```

Or:

```bash
./vendor/bin/phpunit
```

## 🔒 Security

Security improvements planned for the project include:

* Authentication
* Authorization policies
* Private family trees
* Role-based permissions
* Input validation
* CSRF protection
* Rate limiting
* Secure file uploads
* Activity logging

If you discover a security vulnerability, please report it privately rather than opening a public issue.

## 🗺️ Roadmap

* [x] Interactive family tree
* [x] Laravel backend
* [x] Inertia.js integration
* [x] Family Chart.js integration
* [ ] Family member CRUD
* [ ] Relationship management
* [ ] Authentication
* [ ] Multiple family trees
* [ ] Profile photos
* [ ] Family events
* [ ] Search and filters
* [ ] Family statistics
* [ ] Import / Export
* [ ] GEDCOM support
* [ ] PDF export
* [ ] Family collaboration
* [ ] Notifications
* [ ] Mobile optimization

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new family feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

## 📄 License

This project is open-source software licensed under the MIT License.

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

---

**Built with Laravel + Inertia.js + Family Chart.js**
