export const fetchRandomPhoto = async (setRandomPhoto) => {
    const apiKey = "wCYj8T5TMJgfkOjU4GohaXhPTR4ivnanIoRM64SolxQ";
    const apiUrl = 'https://api.unsplash.com/photos/random?query=software';

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Client-ID ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRandomPhoto(data.urls.regular);
    } catch (error) {
        console.error('Error fetching random photo:', error);
    }
};