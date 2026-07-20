let darkmode = localStorage.getItem('darkmode');
const darkmodeToggle = document.getElementById('theme-switch');

const enableDarkmode = () => {
    document.body.classList.add('crm__theme');
    localStorage.setItem('darkmode', 'active');
};

const disableDarkmode = () => {
    document.body.classList.remove('crm__theme');
    localStorage.setItem('darkmode', null);
};

if (darkmode === 'active') {
    enableDarkmode();
}

darkmodeToggle.addEventListener('click', () =>   {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
})