"use strict";

const GET_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const createForm = document.getElementById("create-form");
const createBtn = document.getElementById("create-btn");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const postsContainer = document.getElementById("posts");
const statusBox = document.getElementById("status");

/* ---------- Вспомогательные функции ---------- */

function setStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.className = "status";
}

function clearPosts() {
  postsContainer.textContent = "";
}

function renderPost(title, body) {
  const article = document.createElement("article");
  article.className = "post";

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = body;

  article.appendChild(h3);
  article.appendChild(p);
  postsContainer.appendChild(article);
}

/* ---------- Загрузка публикаций (GET) ---------- */

async function loadPosts() {
  loadBtn.disabled = true;
  clearStatus();
  clearPosts();
  setStatus("Загрузка публикаций…", "info");

  try {
    const response = await fetch(GET_URL);

    if (!response.ok) {
      throw new Error(`Не удалось загрузить публикации (HTTP ${response.status})`);
    }

    const posts = await response.json();

    clearPosts();
    posts.forEach((post) => renderPost(post.title, post.body));
    setStatus(`Загружено публикаций: ${posts.length}`, "success");
  } catch (error) {
    clearPosts();
    setStatus(`Ошибка: ${error.message}`, "error");
  } finally {
    loadBtn.disabled = false;
  }
}

/* ---------- Создание публикации (POST) ---------- */

async function createPost(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    setStatus("Ошибка: заполните оба поля (заголовок и текст).", "error");
    return;
  }

  createBtn.disabled = true;
  clearStatus();
  setStatus("Отправка публикации…", "info");

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 }),
    });

    if (!response.ok) {
      throw new Error(`Не удалось создать публикацию (HTTP ${response.status})`);
    }

    const created = await response.json();

    renderPost(created.title, created.body);
    setStatus(
      `Публикация успешно создана! ID: ${created.id}, заголовок: «${created.title}»`,
      "success"
    );

    createForm.reset();
  } catch (error) {
    setStatus(`Ошибка: ${error.message}`, "error");
  } finally {
    createBtn.disabled = false;
  }
}

/* ---------- Обработчики событий ---------- */

loadBtn.addEventListener("click", loadPosts);
createForm.addEventListener("submit", createPost);