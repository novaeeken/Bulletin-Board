$(document).ready(function(){
			
	// REMOVE
	$(".btn.modifyers.remove").click( function () {
		let id = $(this).attr("id");
		
		$('#buttonDelete').click( function () {
			// slowly fade out the message
			$(`#message${id}`).toggle("drop");
			setTimeout( function () { 
					$(`#message${id}`).replaceWith(" "); 
			}, 1200);

			// send make post request to actually delete from DB
			$.post("/delete", {messageID: id});
		}); 
	});


	// EDIT
	$(".btn.modifyers.edit").click( function () {
		let id = $(this).attr("id");
		
		$.get('/search', {messageID: id}, function(data) {
			let title = data.contentEdit.title;
			let body =  data.contentEdit.body;

			let editFormHTML =
				`<div class="card-body" id="edit-wrapper">
					<form action="/edit" method="post" id="editing-form">
						<div class="form-group">
							<label for="form-title">Title</label>
							<input id="form-title" type="title" name="title" class="form-control" value="${title}"/>
						</div>
						<div class="form-group">
							<label for="message">Text</label>
							<textarea id="message" rows="5" name="body" class="form-control">${body}</textarea>
						</div>
						<div class="form-group">
							<input id="messageID" type="id" name="id" class="form-control" value="${id}" style="display:none;"/>
						</div>
						<div class="buttons form-group">
							<button type="submit" id="editing-form-submit" class="btn btn-primary orange">Save changes</button>
							<button type="button" id="editing-form-dismiss" class="btn btn-secondary">Cancel</button>
						</div>
					</form>
				</div>`
			
			let loading =	`<div id="loader-wrapper">
								<div id="loader">
								</div>
							</div>`

			// hide the body and insert the edit-form
			$(`#body${id}`).toggle();
			$(`#flag${id}`).append(`${editFormHTML}`);
			
			// when submit-button is clicked  
			$('#editing-form-submit').on('click', function () {
				//hide the form and insert the 'loading' div
				$("#edit-wrapper").toggle();
				$(`#flag${id}`).append(`${loading}`);
			}); 

			// when cancel-button is clicked, go back to original
			$('#editing-form-dismiss').on('click', function () {
				$(`#body${id}`).toggle();
				$("#edit-wrapper").toggle();
			});
		}); 
	});


	// HIGHLIGHT AND UN-HIGHLIGHT
	$(".btn.modifyers.highlight").on("click", function () {
		let id = $(this).attr("id"); 
		// catch the div#message+ID that is clicked and then toggle the .highlight class
		$(`#message${id}`).toggleClass("highlight");
		// toggle the icon from a star to an empty star and back
		$(`#star${id}`).toggleClass('glyphicon-star-empty glyphicon-star'); 
	});
});	