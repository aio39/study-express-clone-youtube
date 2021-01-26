import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
	res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
	const {
		body: { name, email, password, password2 },
	} = req;
	if (password !== password2) {
		req.flash("error", "Passwords don't match");
		res.status(400);
		res.render("join", { pageTitle: "Join" });
	} else {
		// To Do: Register User
		try {
			const user = await User({
				name,
				email,
			});
			await User.register(user, password);
			next();
			console.log("✔ Success user postJoin");
		} catch (error) {
			console.log(error);
			console.log("❌Fail user postJoin");
		}
		// To Do: Log user in``
		res.redirect(routes.home);
	}
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Log In" });
export const postLogin = passport.authenticate("local", {
	failureRedirect: routes.login,
	successRedirect: routes.home,
	successFlash: "Welcome",
	failureFlash: "Can't log in. Check email or password",
});

export const githubLogin = passport.authenticate("github", {
	successFlash: "Welcome",
	failureFlash: "Can't log in. Check email or password",
});

export const githubLoginCallback = async (_, __, profile, cb) => {
	const {
		_json: { id, avatar_url: avatarUrl, name, email },
	} = profile;
	try {
		const user = await User.findOne({ email });
		if (user) {
			user.githubId = id;
			user.save();
			return cb(null, user);
		}
		const newUser = await User.create({
			email: "test@emiail.com",
			name,
			githubId: id,
			avatarUrl,
		});
		return cb(null, newUser);
	} catch (error) {
		return cb(error);
	}
};

export const postGithubLogIn = (req, res) => {
	res.redirect(routes.home);
};

//facebook
export const facebookLogin = passport.authenticate("facebook", {
	successFlash: "Welcome",
	failureFlash: "Can't log in. Check email or password",
});

export const facebookLoginCallback = (_, __, profile, cb) => {
	console.log(profile, cb);
};

export const postFacebookLogin = (req, res) => {
	res.redirect(routes.home);
};

export const logout = (req, res) => {
	req.flash("info", "Logged out");
	req.logout();
	res.redirect(routes.home);
};

export const getMe = (req, res) => {
	res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = async (req, res) => {
	const {
		params: { id },
	} = req;
	try {
		const user = await User.findById(id).populate("videos");
		console.log(user);
		res.render("userDetail", { pageTitle: "User Detail", user });
	} catch (error) {
		req.flash("error", "user not founded");
		res.redirect(routes.home);
	}
};
export const getEditProfile = (req, res) => res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
	const {
		body: { name, email },
		file,
	} = req;

	try {
		await User.findByIdAndUpdate(req.user.id, {
			name,
			email,
			avatarUrl: file ? file.location : req.user.avatarUrl,
		});
		req.flash("success", "profile updated");
		res.redirect(routes.me);
	} catch (error) {
		req.flash("error", "can't update Profile");
		res.redirect(routes.editProfile);
	}
};

export const getChangePassword = (req, res) => res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
	const {
		body: { oldPassword, newPassword, newPassword1 },
	} = req;
	try {
		if (newPassword !== newPassword1) {
			req.flash("error", "password dont match");
			res.status(400);
			res.redirect(`/users/${routes.changePassword}`);
			console.log("❌password not same");
			return;
		}
		await req.user.changePassword(oldPassword, newPassword);
		console.log("✔ Success Change Password");
		res.redirect(routes.me);
	} catch (error) {
		console.log("❌ error at password change");
		req.flash("error", "cant change password");
		res.status(400);
		res.redirect(`/users/${routes.changePassword}`);
	}
};
