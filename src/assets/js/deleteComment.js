import axios from "axios";

const deleteCommentBtn = document.getElementsByClassName("jsDeleteComment");
const commentNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
	commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = (target) => {
	target.parentNode.remove(1);
};

const handleDelete = async (event) => {
	event.preventDefault();
	console.log(event);
	const commentId = event.target.value;
	const response = await axios({
		url: `/api/${commentId}/delete-comment`,
		method: "POST",
	});
	if (response.status === 200) {
		decreaseNumber();
		deleteComment(event.target);
	}
};

function init() {
	Array.from(deleteCommentBtn).forEach(function(btn) {
		btn.addEventListener("click", handleDelete);
	});
}

if (deleteCommentBtn) {
	console.log(deleteCommentBtn);
	init();
}

export { handleDelete };
// a(href=routes.deleteComment(comment.id))#jsDeleteComment
