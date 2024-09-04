$(document).ready(function() {
    console.log("getlist view function");
    //deteck BASE_URL automatically 
    const BASE_URL=window.location.origin;
    console.log("Your BASE_URL is : ",BASE_URL)

  
    // Function to calculate the difference in days between two dates
    function calculateDaysDifference(createdAt, updatedAt) {
      if (!updatedAt) {
        return 'No update';
      }
      const createdDate = new Date(createdAt);
      const updatedDate = new Date(updatedAt);
      const timeDiff = Math.abs(updatedDate - createdDate);
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return `${dayDiff} days ago`;
    }
  
    async function fetchListView() {
      try {
        const response = await fetch(`${BASE_URL}/plans/allplans`);
        const data = await response.json();
        console.log("data from fetch", data.plans);
  
        // Clear any existing rows in the table
        $('#program-table tbody').empty();
  
        // Set form title Create New Plan as default 
        $('#new-plan-form-title').text("Create New Plan");
  
        // Dynamically append list items
        data.plans.forEach(plan => {
          const daysDifference = calculateDaysDifference(plan.createdAt, plan.updatedAt);
  
          $('#program-table tbody').append(`
            <tr>
              <td>${plan.id}</td>
              <td ><h6>${plan.planName} </h4></td>
              <td>${new Date(plan.createdAt).toLocaleDateString()}</td>
              <td>${plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : 'N/A'}</td>
              <td>${daysDifference}</td>
              <td class="d-flex align-middle">
                <button class="btn btn-primary me-4 show-details-btn" data-plan-id="${plan.id}"><i class="bi bi-book-half"></i>Show Details</button>
                <button class="btn btn-secondary me-4 update-plan-btn" data-plan-id="${plan.id}"><i class="bi bi-pencil-square"></i>Update Plan</button>
                <button class="btn btn-danger me-4 delete-plan-btn" data-plan-id="${plan.id}"><i class="bi bi-eraser-fill"></i>Delete Plan</button>
              </td>
            </tr>
          `);
        });
  
        // Add click event to "Show Details" button
        $('#program-table').on('click', '.show-details-btn', function() {
          const planId = $(this).data('plan-id'); // Get the plan ID from the button
          const selectedPlan = data.plans.find(plan => plan.id === planId); // Find the plan by ID
  
          // Update the modal content with all details
          $('.modal-title').text(`Plan ID: ${selectedPlan.id} - ${selectedPlan.planName}`);
          $('.modal-body').html(`
            <p><strong>Name:</strong> ${selectedPlan.planName}</p>
            <p><strong>Languages:</strong> ${selectedPlan.usedLanguages.join(", ")}</p>
            <p><strong>Local Location:</strong> ${selectedPlan.localLocation}</p>
            <p><strong>GitHub Link:</strong> <a href="${selectedPlan.githubLink}" target="_blank">${selectedPlan.githubLink || 'N/A'}</a></p>
            <p><strong>Program Notes:</strong> ${selectedPlan.programNotes || 'N/A'}</p>
            <p><strong>Tips & Tricks:</strong> ${selectedPlan.tipsTricks || 'N/A'}</p>
            <p><strong>What is Done:</strong> ${selectedPlan.whatDone || 'N/A'}</p>
            <p><strong>What to Do:</strong> ${selectedPlan.whatToDo || 'N/A'}</p>
            <p><strong>Author:</strong> ${selectedPlan.author}</p>
            <p><strong>Created At:</strong> ${new Date(selectedPlan.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> ${selectedPlan.updatedAt ? new Date(selectedPlan.updatedAt).toLocaleString() : 'N/A'}</p>
          `);
  
          // Show the modal
          $('.modal').modal('show');
        });
  
        // Add click event to "Update Plan" button
        $('#program-table').on('click', '.update-plan-btn', function() {
          const planId = $(this).data('plan-id');
          console.log("Update Plan ID:", planId);
  
          // Find the plan by ID 
          const toUpdatePlan = data.plans.find(plan => plan.id === planId);
          console.log(toUpdatePlan);
  
          // Populate form with plan details
          $('#planName').val(toUpdatePlan.planName);
          $('#usedLanguages').val(toUpdatePlan.usedLanguages.join(','));
          $('#localLocation').val(toUpdatePlan.localLocation);
          $('#githubLink').val(toUpdatePlan.githubLink);
          $('#programNotes').val(toUpdatePlan.programNotes);
          $('#tipsTricks').val(toUpdatePlan.tipsTricks);
          $('#whatDone').val(toUpdatePlan.whatDone);
          $('#whatToDo').val(toUpdatePlan.whatToDo);
          $('#author').val(toUpdatePlan.author);
  
          // Store the plan ID in a hidden field or data attribute for later use
          $('#update-plan-button').data('plan-id', planId);
  
          // Enable update button and change style
          $('#update-plan-button').removeClass('disabled').addClass('btn-danger').removeClass('btn-secondary');
          $('#new-plan-form-title').text("Update an Existing Program").addClass('bg-warning');
        });
  
        // Clear form fields only
        $('#clear-form-button').on('click', function() {
          console.log("Pressed clear form button");
          $('#newPlanForm input[type="text"]').val('');
          $('#newPlanForm input[type="url"]').val('');
          $('#newPlanForm textarea').val('');
          $('#new-plan-form-title').text("Create New Plan").addClass('bg-info');
          $('#update-plan-button').addClass('disabled bg-warning');
        });
  
        // Add click event to "Delete Plan" button
        $('#program-table').on('click', '.delete-plan-btn', function() {
          const planId = $(this).data('plan-id');
          console.log("Delete Plan ID:", planId);
          const userConfirmed = confirm("Are you sure you want to delete this plan?");
          if (userConfirmed) {
            fetch(`${BASE_URL}/plans/deleteplan/${planId}`, {
              method: 'DELETE'
            })
            .then(response => {
              if (response.ok) {
                alert('Plan deleted successfully!');
                $(this).closest('tr').remove();
              } else {
                alert('Failed to delete the plan. Please try again.');
              }
            })
            .catch(error => {
              console.error('Error deleting plan:', error);
              alert('An error occurred. Please try again.');
            });
          }
        });
  
        // Update button click event to send PUT request to server
        $('#update-plan-button').on('click', function() {
          console.log("Update button pressed");
  
          if (!$(this).hasClass('disabled')) {
            const formDataArray = $('#newPlanForm').serializeArray();
            const formDataObject = {};
  
            formDataArray.forEach(item => {
              if (item.name !== 'createdAt') { // Exclude unnecessary fields
                formDataObject[item.name] = item.value;
              }
            });
  
            formDataObject.usedLanguages = formDataObject.usedLanguages ? formDataObject.usedLanguages.split(',').map(lang => lang.trim()) : [];
            formDataObject.isDeleted = false;
  
            console.log("Form data prepared for update:", formDataObject);
  
            const planId = $(this).data('plan-id');  // Get the plan ID from data attribute
  
            if (planId === undefined) {
              console.error("Plan ID is undefined.");
              alert("An error occurred. Please try again.");
              return;
            }
  
            $.ajax({
              url: `${BASE_URL}/plans/updateplan/${planId}`,
              method: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(formDataObject),
              success: function(response) {
                console.log("Update successful:", response);
                alert('Plan updated successfully!');
                $('#newPlanForm')[0].reset();
  
                // Clear the table and reload the list view
                $('#program-table tbody').empty(); // Clear the table before reloading data
                fetchListView();  // Reload the table view
              },
              error: function(error) {
                console.error("Error updating plan:", error);
                alert('Failed to update plan. Please try again.');
              }
            });
          } else {
            console.log("Update button is disabled.");
          }
        });
  
      } catch (error) {
        console.error("Error fetching list view data:", error);
      }
    }
  
    // Fetch the list view when the document is ready
    fetchListView();
  });
  