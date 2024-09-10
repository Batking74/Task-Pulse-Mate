// Importing Modules/Packages

export default function ErrorPage() {
    return (
        <main style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Oops! Something went wrong.</h1>
            <p>We're sorry, but we couldn't load the page you requested.</p>
            <a href="/">Go back to the homepage</a>
        </main>
    );
};