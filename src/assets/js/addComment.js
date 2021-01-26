import axios from "axios";
import { handleDelete } from "./deleteComment";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
	commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment, commentId) => {
	const li = document.createElement("li");
	const span = document.createElement("span");
	const button = document.createElement("button");
	span.innerHTML = comment;
	button.innerHTML = "X";
	button.className = "jsDeleteComment";
	button.value = commentId;
	button.addEventListener("click", handleDelete);
	li.appendChild(span);
	li.appendChild(button);
	commentList.prepend(li);
	increaseNumber();
};

const sendComment = async (comment) => {
	const videoId = window.location.href.split("/videos/")[1];
	const response = await axios({
		url: `/api/${videoId}/comment`,
		method: "POST",
		data: {
			comment, // postAddComment의 body의 comment에 들어감
		},
	});
	const commentId = response.data.commentId;
	if (response.status === 200) {
		addComment(comment, commentId);
	}
};

const handleSubmit = (event) => {
	event.preventDefault(); // prevent refresh
	const commentInput = addCommentForm.querySelector("input");
	const comment = commentInput.value;
	sendComment(comment); // 로그인한 상태여야만함
	commentInput.value = "";
};

function init() {
	addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
	init();
}
