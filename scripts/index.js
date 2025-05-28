// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileImage = document.querySelector(".profile__image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const nameInput = profilePopup.querySelector(".popup__input_type_name");
const jobInput = profilePopup.querySelector(".popup__input_type_description");
const avatarUrlInput = profilePopup.querySelector(".popup__input_type_avatar-url");
const localAvatarInput = profilePopup.querySelector(".popup__input_type_file");
const profileHint = profilePopup.querySelector(".popup__hint"); // Подсказка для профиля
const profileFormElement = profilePopup.querySelector(".popup__form");
const cardAddButton = document.querySelector(".profile__add-button");
const cardFormElement = cardPopup.querySelector(".popup__form");
const placeNameInput = cardFormElement.querySelector(".popup__input_type_card-name");
const placeLinkInput = cardFormElement.querySelector(".popup__input_type_url");
const localImageInput = cardFormElement.querySelector(".popup__input_type_file");
const cardHint = cardPopup.querySelector(".popup__hint"); // Подсказка для карточек

if (!localAvatarInput || !localImageInput || !profileHint || !cardHint) {
  console.error("localAvatarInput, localImageInput, profileHint или cardHint не найдены в DOM! Проверь HTML поп-апов.");
} else {
  console.log("localAvatarInput, localImageInput, profileHint и cardHint найдены.");
}

// @todo: Функция создания карточки
function createCard(cardData) {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });
  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_is-active");
  });
  cardImage.addEventListener("click", () => {
    const popupImage = imagePopup.querySelector(".popup__image");
    const popupCaption = imagePopup.querySelector(".popup__caption");
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
function renderCards() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(cardData);
    placesList.append(cardElement);
  });
}

// Общие функции для поп-апов
function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Закрытие поп-апов по оверлею и Esc
const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", () => {
    closeModal(popup);
  });

  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Функция для переключения доступности полей (для профиля и карточек)
function toggleInputModes(inputUrl, inputFile, hintElement = null) {
  if (!inputFile) {
    console.error("inputFile не найден при вызове toggleInputModes!");
    return;
  }

  const hasUrl = inputUrl.value.trim() !== "";
  const hasFile = inputFile.files.length > 0;

  console.log("ToggleInputModes:", { hasUrl, hasFile, inputFileDisabled: inputFile.disabled });

  if (hasUrl && !hasFile) {
    inputFile.disabled = true;
    inputFile.required = false;
    inputUrl.required = true;
    inputUrl.disabled = false;
    if (hintElement) hintElement.style.display = "block"; // Показываем подсказку
    console.log("URL active, file disabled");
  } else if (hasFile && !hasUrl) {
    inputFile.disabled = false;
    inputFile.required = false; // Файл уже выбран
    inputUrl.disabled = true;
    inputUrl.required = false;
    if (hintElement) hintElement.style.display = "none"; // Скрываем подсказку
    console.log("File active, URL disabled");
  } else if (!hasUrl && !hasFile) {
    inputFile.disabled = false; // Разрешаем выбор файла, если URL пуст
    inputFile.required = false;
    inputUrl.disabled = false;
    inputUrl.required = true;
    if (hintElement) hintElement.style.display = "none"; // Скрываем подсказку
    console.log("No URL, file enabled");
  } else {
    inputFile.disabled = true;
    inputFile.required = false;
    inputUrl.disabled = false;
    inputUrl.required = true;
    if (hintElement) hintElement.style.display = "none"; // Скрываем подсказку
    console.log("Default: URL required, file disabled");
  }
}

// Обработчики для профиля
function handleProfileEditButtonClick() {
  if (!localAvatarInput || !profileHint) {
    console.error("localAvatarInput или profileHint не найдены при открытии поп-апа!");
    return;
  }

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  avatarUrlInput.value = profileImage.style.backgroundImage.slice(5, -2); // Извлекаем URL из background-image
  localAvatarInput.value = ""; // Сбрасываем выбор файла
  localAvatarInput.disabled = true; // Изначально файл отключён
  avatarUrlInput.disabled = false;
  avatarUrlInput.required = true;
  toggleInputModes(avatarUrlInput, localAvatarInput, profileHint);
  openModal(profilePopup);
}

profileEditButton.addEventListener("click", handleProfileEditButtonClick);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const description = jobInput.value;

  if (!name || !description) {
    alert("Пожалуйста, укажите имя и занятие.");
    return;
  }

  let avatarUrl;
  if (localAvatarInput.files.length > 0) {
    const file = localAvatarInput.files[0];
    if (!file) {
      alert("Пожалуйста, выберите файл аватарки.");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
      avatarUrl = e.target.result;
      profileImage.style.backgroundImage = `url(${avatarUrl})`;
      profileTitle.textContent = name;
      profileDescription.textContent = description;
      closeModal(profilePopup);
    };

    reader.readAsDataURL(file);
  } else if (avatarUrlInput.value) {
    avatarUrl = avatarUrlInput.value;
    profileImage.style.backgroundImage = `url(${avatarUrl})`;
    profileTitle.textContent = name;
    profileDescription.textContent = description;
    closeModal(profilePopup);
  } else {
    profileTitle.textContent = name;
    profileDescription.textContent = description;
    closeModal(profilePopup);
  }
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// Обработчики для добавления карточки
function handleCardAddButtonClick() {
  if (!localImageInput || !cardHint) {
    console.error("localImageInput или cardHint не найдены при открытии поп-апа!");
    return;
  }

  placeNameInput.value = "";
  placeLinkInput.value = "";
  localImageInput.value = ""; // Сбрасываем выбор файла
  localImageInput.disabled = true; // Изначально файл отключён
  placeLinkInput.disabled = false;
  placeLinkInput.required = true;
  toggleInputModes(placeLinkInput, localImageInput, cardHint);
  openModal(cardPopup);
}

cardAddButton.addEventListener("click", handleCardAddButtonClick);

// Обновляем состояние полей при вводе
avatarUrlInput.addEventListener("input", () => toggleInputModes(avatarUrlInput, localAvatarInput, profileHint));
localAvatarInput.addEventListener("change", () => toggleInputModes(avatarUrlInput, localAvatarInput, profileHint));
placeLinkInput.addEventListener("input", () => toggleInputModes(placeLinkInput, localImageInput, cardHint));
localImageInput.addEventListener("change", () => toggleInputModes(placeLinkInput, localImageInput, cardHint));

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const name = placeNameInput.value;
  const link = placeLinkInput.value;

  if (!name) {
    alert("Пожалуйста, укажите название.");
    return;
  }

  let cardData;
  if (localImageInput.files.length > 0) {
    const file = localImageInput.files[0];
    if (!file) {
      alert("Пожалуйста, выберите файл.");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
      cardData = {
        name: name,
        link: e.target.result,
      };
      const newCardElement = createCard(cardData);
      placesList.prepend(newCardElement);
      closeModal(cardPopup);
    };

    reader.readAsDataURL(file);
  } else if (link) {
    cardData = {
      name: name,
      link: link,
    };
    const newCardElement = createCard(cardData);
    placesList.prepend(newCardElement);
    closeModal(cardPopup);
  } else {
    alert("Пожалуйста, укажите ссылку или выберите файл.");
  }
}

cardFormElement.addEventListener("submit", handleCardFormSubmit);

// Обработчик для открытия аватарки
profileImage.addEventListener("click", () => {
  const popupImage = imagePopup.querySelector(".popup__image");
  const popupCaption = imagePopup.querySelector(".popup__caption");
  const avatarUrl = profileImage.style.backgroundImage.slice(5, -2); // Извлекаем URL аватарки
  popupImage.src = avatarUrl;
  popupImage.alt = profileTitle.textContent;
  popupCaption.textContent = profileTitle.textContent;
  openModal(imagePopup);
});

// Инициализация карточек
renderCards();