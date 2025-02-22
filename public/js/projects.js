document.addEventListener('DOMContentLoaded', () => {
    const researchProjects = [
        {
            name: "Enron Email Analysis",
            pdfUrl: "/pdfs/Enron_Analysis_Paper.pdf",
            imageUrl: "/images/projectpreviews/enronpreview.jpg"
        },
        {
            name: "MiLB wOBA Metric Analysis",
            pdfUrl: "/pdfs/milb_wOBA.pdf",
            imageUrl: "/images/projectpreviews/wOBApreview.jpg"
        },
        {
            name: "Yelp Review Project",
            pdfUrl: "/pdfs/JudyMikeFinalProj.pdf",
            imageUrl: "/images/projectpreviews/yelppreview.jpg"
        },
        {
            name: "Airbnb Market Analysis",
            pdfUrl: "/pdfs/airbnb_analysis.pdf",
            imageUrl: "/images/projectpreviews/airbnbpreview.jpg"
        }
    ];

    const applications = [
        {
            name: "Bridge Platform",
            link: "https://bridge.haverford.edu",
            imageUrl: "/images/projectpreviews/bridgepreview.jpg"
        }
    ];

    const researchList = document.getElementById('research-projects-list');
    const applicationsList = document.getElementById('applications-list');

    researchProjects.forEach(project => {
        const li = document.createElement('li');
        li.classList.add('project-item');
        li.innerHTML = `
            <a href="${project.pdfUrl}" target="_blank">
                <img src="${project.imageUrl}" alt="${project.name} preview">
                <div><strong>${project.name}</strong></div>
            </a>
        `;
        researchList.appendChild(li);
    });

    applications.forEach(app => {
        const li = document.createElement('li');
        li.classList.add('project-item');
        li.innerHTML = `
            <a href="${app.link}" target="_blank">
                <img src="${app.imageUrl}" alt="${app.name} preview">
                <div><strong>${app.name}</strong></div>
            </a>
        `;
        applicationsList.appendChild(li);
    });
});

