const Utils = Chart.helpers;

async function fetchBookGenres() {
  const response = await fetch('http://localhost:3000/Books'); // Make sure your db.json server is running
  const books = await response.json();

  const genreCounts = {};
  books.forEach(book => {
    genreCounts[book.Genre] = (genreCounts[book.Genre] || 0) + 1;
  });

  return genreCounts;
}

fetchBookGenres().then(genreCounts => {
  const labels = Object.keys(genreCounts);
  const dataValues = Object.values(genreCounts);
  const colors = labels.map((_, i) =>
    Object.values(Chart.helpers.color)[i % Object.keys(Chart.helpers.color).length] || 'rgba(0,0,0,0.5)'
  );

  const data = {
    labels: labels,
    datasets: [{
      label: 'Books by Genre',
      data: dataValues,
      backgroundColor: colors,
    }]
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Books by Genre'
        }
      }
    }
  };

  new Chart(document.getElementById('myChart'), config);
});
