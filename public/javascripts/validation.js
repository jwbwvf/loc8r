$('#addReview').submit(function (e) {
	console.log("inside addReview submit");
	$('.alert.alert-danger').hide();
	if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
		console.log("inside input select or textarea empty");
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
			console.log("after show alert");
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
		}
		return false;
	}
});