let infoModal;
let usefulLinksModal;
function createUsefulLinksModal() {
  const modal = document.createElement("div");
  setUpModal(modal, "useful_links_modal");
  const modalContent = createUsefulLinksModalContent();
  modal.appendChild(modalContent);
  return modal;
}
function createUsefulLinksModalContent() {
  const modalContent = document.createElement("div");
  styleModalContent(modalContent);
  const usefulContent = createUsefulContent();
  const hrefs = new Map([
    ["gewlaht - BoooM", "https://www.managerzone.com/?p=forum&sub=topic&topic_id=11415137&forum_id=49&sport=soccer"],
    ["honken91 - taktikskola", "https://www.managerzone.com/?p=forum&sub=topic&topic_id=12653892&forum_id=4&sport=soccer"],
    ["peto - mix de dibujos", "https://www.managerzone.com/?p=forum&sub=topic&topic_id=12196312&forum_id=255&sport=soccer"],
    ["The Zone Chile", "https://www.managerzone.com/thezone/paper.php?paper_id=18036&page=9&sport=soccer"]
  ]);
  const usefulLinksList = createLinksList(hrefs);
  modalContent.appendChild(usefulContent);
  modalContent.appendChild(usefulLinksList);
  return modalContent;
}
function createUsefulContent() {
  const usefulContent = document.createElement("p");
  usefulContent.id = "useful_content";
  usefulContent.textContent = strings.usefulContent;
  return usefulContent;
}
function createLinksList(hrefs) {
  const list = document.createElement("ul");
  hrefs.forEach((href, title) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = title;
    listItem.appendChild(link);
    list.appendChild(listItem);
  });
  return list;
}
function setUsefulLinksModal() {
  usefulLinksModal = createUsefulLinksModal();
  document.body.appendChild(usefulLinksModal);
}
function createInfoModal() {
  const modal = document.createElement("div");
  setUpModal(modal, "info_modal");
  const modalContent = createModalContent();
  modal.appendChild(modalContent);
  return modal;
}
function createModalContent() {
  const modalContent = document.createElement("div");
  styleModalContent(modalContent);
  const title = createTitle();
  const infoText = createInfoText();
  const feedbackText = createFeedbackText();
  modalContent.appendChild(title);
  modalContent.appendChild(infoText);
  modalContent.appendChild(feedbackText);
  return modalContent;
}
function createTitle() {
  const title = document.createElement("h2");
  title.id = "info_modal_title";
  title.textContent = "MZ Tactics Selector";
  title.style.fontSize = "24px";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "20px";
  return title;
}
function createInfoText() {
  const infoText = document.createElement("p");
  infoText.id = "info_modal_info_text";
  infoText.innerHTML = strings.modalContentInfoText;
  return infoText;
}
function createFeedbackText() {
  const feedbackText = document.createElement("p");
  feedbackText.id = "info_modal_feedback_text";
  feedbackText.innerHTML = strings.modalContentFeedbackText;
  return feedbackText;
}
function setInfoModal() {
  infoModal = createInfoModal();
  document.body.appendChild(infoModal);
}
function setUpModal(modal, id) {
  modal.id = id;
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.zIndex = "1";
  modal.style.left = "50%";
  modal.style.top = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.opacity = "0";
  modal.style.transition = "opacity 0.5s ease-in-out";
}
function styleModalContent(content) {
  content.style.backgroundColor = "#fefefe";
  content.style.margin = "auto";
  content.style.padding = "20px";
  content.style.border = "1px solid #888";
  content.style.width = "80%";
  content.style.maxWidth = "500px";
  content.style.borderRadius = "10px";
  content.style.fontFamily = "Montserrat, sans-serif";
  content.style.textAlign = "center";
  content.style.color = "#000";
  content.style.fontSize = "16px";
  content.style.lineHeight = "1.5";
}
function toggleModal(modal) {
  if (modal.style.display === "none" || modal.style.opacity === "0") {
    showModal(modal);
  } else {
    hideModal(modal);
  }
}
function showModal(modal) {
  modal.style.display = "block";
  setTimeout(function () {
    modal.style.opacity = "1";
  }, 0);
}
function hideModal(modal) {
  modal.style.opacity = "0";
  setTimeout(function () {
    modal.style.display = "none";
  }, 500);
}
function setUpModalsWindowClickListener() {
  window.addEventListener("click", function (event) {
    if (usefulLinksModal.style.display === "block" && !usefulLinksModal.contains(event.target)) {
      hideModal(usefulLinksModal);
    }
    if (infoModal.style.display === "block" && !infoModal.contains(event.target)) {
      hideModal(infoModal);
    }
  });
}
function createUsefulLinksButton() {
  const button = document.createElement("button");
  setUpButton(button, "useful_links_button", strings.usefulLinksButton);
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleModal(usefulLinksModal);
  });
  return button;
}
function createAboutButton() {
  const button = document.createElement("button");
  setUpButton(button, "about_button", strings.aboutButton);
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleModal(infoModal);
  });
  return button;
}
