# Bookish Frontend

Bookish is a mobile app built with React Native and TypeScript that allows users to discover, organize, and review books. Similar to Goodreads, users can create an account, browse a vast collection of books, and manage their personal library across three bookshelves: "Want to Read," "Currently Reading," and "Read." Users can rate and review books when adding them to their "Read" bookshelf.

Additionally, Bookish offers genre-based recommendations by allowing users to select their favorite genres. The app provides a personalized reading experience by suggesting books based on the user's preferences. Users can also view an overview of their bookshelves, favorite genres, and reading activity on their profile.

## Key Features

- User authentication: Create an account and securely log in.
- Book browsing: Explore an extensive collection of books from the Google Books API.
- Bookshelves: Manage books across three bookshelves: "Want to Read," "Currently Reading," and "Read."
- Ratings and reviews: Rate and review books when adding them to the "Read" bookshelf.
- Genre preferences: Select favorite genres to receive personalized book recommendations.
- Profile overview: Display a summary of bookshelves, favorite genres, and reading activity.

## Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/v-prt/bookish-frontend.git
   ```
2. Navigate to the project directory:
   ```shell
   cd bookish-frontend
   ```
3. Install dependencies:
   ```shell
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Set the following environment variable in the `.env` file:

   ```plaintext
   REACT_APP_API_URL=http://<your-ip-address>:<your-port-number>/bookish-api/v1
   ```

   Replace `<your-ip-address>` with your computer's IP address (in IPv4 format) and `<your-port-number>` with the port number you designated for your server in the backend. This will allow your frontend application to send requests to your local server.

   **Note:** Ensure the `.env` file is added to your `.gitignore` to avoid committing sensitive data to your version control system.

   Proceed to the "Server Setup" section below for the details on setting up your backend.

## Usage

1. Start the development server:
   ```shell
   npm start
   ```
2. Run the app on an iOS/Android emulator or physical device:
   ```shell
   npm run ios  # for iOS
   npm run android  # for Android
   ```

## Testing

Bookish includes unit tests written with Vitest. To run the tests, use the following command:
```shell
npm test
```

## Contributing

Contributions are welcome! If you would like to contribute to Bookish, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Commit your changes.
4. Push the branch to your forked repository.
5. Open a pull request with a detailed description of your changes.

Please ensure that your code adheres to the existing code style and includes appropriate tests.

## Server Setup

The server and API for Bookish is available in the [bookish-backend](https://github.com/v-prt/bookish-backend) repository. Make sure to set up the backend before running the frontend application.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google Books API](https://developers.google.com/books)
- [Vitest](https://vitest.dev/) (for testing)
