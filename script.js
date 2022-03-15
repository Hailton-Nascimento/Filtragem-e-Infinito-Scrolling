const postsContainer = document.querySelector("#posts-container");
const loaderContainer = document.querySelector(".loader");
const filterInput = document.querySelector("#filter");
const url = "https://jsonplaceholder.typicode.com/posts?_limit=5&_page=";

let page = 1;


const debounce = function(func, wait, immediate) {
    let timeout;
    return function(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const getPost = async() => {
    try {
        const response = await fetch(`${url}${page}`);
        const data = await response.json();
        if (response.ok) {
            return data;
        }
        throw new Error("Lambento Não foi possivel conectar com a Api.");
    } catch (error) {
        console.log(error.message);
        showWornings(error.message)
    }
};

const generatePostsTemplate = posts =>
    posts.map(({ id, title, body }) => `
    <div class="post">
       <div class="number">${id}</div>
       <div class="post-info">
            <h2 class="post-title">${title}</h2>
            <p class="post-body">${body}</p>
       </div>
    </div>`)
    .join("");


const addPostIntoDOM = async() => {
    try {
        const posts = await getPost();
        const postsTemplate = generatePostsTemplate(posts)
        postsContainer.innerHTML += postsTemplate;
    } catch (error) {
        console.log(error.message);
    }
};


const getNextPosts = () => {
    setTimeout(() => {
        page++;
        addPostIntoDOM();
    }, 300);
};

const removeLoader = () => {
    setTimeout(() => {
        loaderContainer.classList.remove("show");
        getNextPosts();
    }, 1000);
};

const showLoader = () => {
    loaderContainer.classList.add("show");
    removeLoader();
};

const handleScrollToPageBottom = () => {
    const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
    const isPageBottonAlmostReached =
        scrollTop + clientHeight >= scrollHeight - 10;
    if (isPageBottonAlmostReached) {
        showLoader();
    }
};

const showPostIfMathInputValue = value => (post) => {
    const [postTitle, postBody] = ["post-info", "post-body"]
    .map((classe) => post.querySelector(`.${classe}`)
        .textContent.toLowerCase()
    );

    const postContainsInputValue =
        postTitle.includes(value) || postBody.includes(value);
    if (postContainsInputValue) {
        post.style.display = "flex";
        return;
    }
    post.style.display = "none";
};

const handleInputValue = ({ target: { value } }) => {
    value = value.toLowerCase();
    const posts = document.querySelectorAll(".post");
    posts.forEach(showPostIfMathInputValue(value));
};

addPostIntoDOM();

window.addEventListener("scroll", debounce(handleScrollToPageBottom, 200));
filterInput.addEventListener("input", handleInputValue);