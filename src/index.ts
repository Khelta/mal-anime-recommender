function handleRecommondationButtonClick() {
    const formElement = document.getElementById("form") as HTMLFormElement
    const formData = new FormData(formElement)
    const username = formData.get("username")

    const selectedStatuses: string[] = [];

    document.querySelectorAll('.btn-status.active').forEach(button => {
        const status = button.getAttribute('data-status');
        if (status) {
            selectedStatuses.push(status);
        }
    });

    const status_string = selectedStatuses.join("")

    const hostUrl = window.location.origin;
    const apiUrl = `${hostUrl}/api/random_anime?username=${username}&status=${status_string}`;

    const input_view = document.getElementById('input-view') as HTMLElement
    const result_view = document.getElementById("result-view") as HTMLElement
    const alert = document.getElementById("alert") as HTMLElement

    input_view?.classList.add("disabled")
    alert?.classList.add("hidden")

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const titleElement = document.getElementById('recommondation-title') as HTMLElement
            titleElement.textContent = data.title
            const textElement = document.getElementById('recommondation-text') as HTMLElement
            textElement.textContent = data.text
            const imageElement = document.getElementById('preview-image') as HTMLImageElement
            imageElement.src = data.img_link

            input_view.classList.remove("disabled")
            input_view.classList.add("hidden")
            result_view.classList.remove("hidden")

        })
        .catch(error => {
            input_view.classList.remove("disabled")
            alert.classList.remove("hidden")
            alert.textContent = `Error: ${error.message}`;
        })

}

function handleBackButtonClick() {
    const input_view = document.getElementById('input-view') as HTMLElement
    const result_view = document.getElementById('result-view') as HTMLElement

    result_view.classList.add("hidden")
    input_view.classList.remove("hidden")
}

// Toggle status buttons
document.querySelectorAll('.btn-status').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

// Recommondation button 
document.getElementById("rec-button")?.addEventListener('click', function (event) {
    event.preventDefault();
    handleRecommondationButtonClick()
}
)

document.getElementById("back-button")?.addEventListener('click', handleBackButtonClick)


const toggle = document.getElementById('darkModeToggle') as HTMLInputElement;
const icon = document.getElementById('toggle-icon');
let theme = "light"
document.body.setAttribute('data-theme', theme);
toggle.checked = theme === 'light'; 

toggle.addEventListener('change', () => {
  const newTheme = toggle.checked ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  icon!.textContent = toggle.checked ? '💡' : '🌙';
});
