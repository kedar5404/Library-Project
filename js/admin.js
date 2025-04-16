document.getElementById("viewAuthorBtn").addEventListener("click", function (e) {
    e.preventDefault();
    loadPage("author.html");  // if author.html is inside the "pages" folder
});

document.getElementById("book-master").addEventListener("click", function (e) {
    e.preventDefault();
    loadPage("add-book.html");  // if add-book is inside the "pages" folder
});

function loadPage(page) {
    fetch(`pages/${page}`)
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById('main-content');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            // Only extract and insert <body> content if needed
            const bodyContent = tempDiv.querySelector('body')?.innerHTML || tempDiv.innerHTML;
            container.innerHTML = bodyContent;

            // Extract and evaluate scripts manually
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    // Adjust the path if needed
                    const src = script.src.split('/').pop(); // Get just the filename
                    newScript.src = `js/${src}`; // Assuming all scripts are in js/
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
        })
        .catch(err => {
            document.getElementById('main-content').innerHTML =
                '<p class="text-danger">Failed to load content.</p>';
            console.error(err);
        });
}
