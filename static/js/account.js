$(document).ready(function() {
    $('.js-btn-create').click(function (event) {
        $('#create-account-modal').modal('show');
    })

    $('.js-resource-delete').click(function (event) {
        event.preventDefault();
        $('#delete-account-modal').modal('show');
        const url = this.getAttribute("href");
        $('#delete-account-form').submit(function (event){
            event.preventDefault();
            $.ajax({
                type: 'POST',
                url: url,
                success: function(response) {
                    if (response.error) {
                        presentToast('Có lỗi xảy ra', 'danger');
                    } else {
                        $('#delete-account-modal').modal('hide');
                        presentToast('Thành công', 'success');
                        $("tr[data-id=" + response.id +"]").remove();
                    }
                },
                error: function(xhr, status, error) {   
                    console.log(error);
                }
                }); 
        })
    })

    $('.js-resource-edit').click(function (event) {
        event.preventDefault();
        const url = this.getAttribute("href");
        const trElement = $(this).closest("tr"); 
        const username = trElement.find("td:eq(0)").text(); // Lấy giá trị của cột đầu tiên
        const displayName = trElement.find("td:eq(1)").text(); // Lấy giá trị của cột thứ hai
        const email = trElement.find("td:eq(2)").text(); // Lấy giá trị của cột thứ ba
        const role = trElement.find("td:eq(3)").text();

        $("#user-name-edit").val(username);
        $("#name-edit").val(displayName);
        $("#email-edit").val(email);
        $("#role-edit").val(role);

        $('#edit-account-modal').modal('show');

        $('#edit-account-form').submit(function (event){
            event.preventDefault();
            const user_name = $('#user-name-edit').val();
            const name = $('#name-edit').val();
            const email = $('#email-edit').val();
            const role = $('#role-edit').val();
            const password = $('#pass-edit').val();
            const confirm_password = $('#confirm-pass-edit').val();
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    user_name: user_name,
                    name: name,
                    email: email,
                    role: role,
                    password: password,
                    confirm_password: confirm_password
                },
                success: function(response) {
                    if (response.error) {
                        presentToast('Có lỗi xảy ra', 'danger');
                    } else {
                        $('#edit-account-modal').modal('hide');
                        presentToast('Thành công', 'success');
                        trElement.find("td:eq(1)").text(name);
                        trElement.find("td:eq(2)").text(email);
                        trElement.find("td:eq(3)").text(role);
                    }
                },
                error: function(xhr, status, error) {   
                    console.log(error);
                }
                }); 
        })
    })

    $('#create-account-form').submit(function (event) {
        event.preventDefault();
        if($(".error-message")) {
            $(".error-message").remove();
        }
        const user_name = $('#user-name').val();
        const name = $('#name').val();
        const email = $('#email').val();
        const role = $('#role').val();
        const password = $('#password').val();
        const confirm_password = $('#confirm-password').val();
        $.ajax({
        type: 'POST',
        url: '/create-user',
        data: {
            user_name: user_name,
            name: name,
            email: email,
            role: role,
            password: password,
            confirm_password: confirm_password
        },
        success: function(response) {
            if (response.error) {
                error = document.querySelector(".error")
                error.innerHTML = '<p class="alert alert-danger error-message">' + response.error + '</p>'
            } else {
                $('#create-account-modal').modal('hide');
                presentToast('Thành công', 'success');
            }
        },
        error: function(xhr, status, error) {   
            console.log(error);
        }
        });
    });

    const presentToast = (message, options) => {
        if (typeof options === 'undefined') {
            options = {};
        } else if (typeof options === 'string') {
            options = {type: options};
        }
    
        if (!message) {
            if (options.type === 'danger') {
                message = 'Đã xảy ra lỗi không mong muốn';
            } else {
                return;
            }
        }
    
        const toastElement = document.createElement('div');
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        toastElement.classList.add('toast', 'align-items-center');
    
        let buttonClass = 'btn-close me-2 m-auto';
    
        if (options.type && options.type !== 'info') {
            toastElement.classList.add('text-bg-' + options.type, 'border-0');
            buttonClass += ' btn-close-white';
        }
    
        toastElement.innerHTML = `<div class="d-flex">
            <div class="toast-body fw-bold">${message}</div>
            <button type="button" class="${buttonClass}" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>`;
    
        const toastContainer = getToastContainer();
    
        // Use this if you hate stacking
        // toastContainer.querySelectorAll(`.toast`).forEach(_ => _.remove());
    
        toastContainer.appendChild(toastElement);
        toastElement.addEventListener('hidden.bs.toast', e => e.target.remove());
    
        const toast = new bootstrap.Toast(toastElement, options);
        toast.show();
        return toast;
    };
    
    const getToastContainer = () => {
        let element = document.querySelector(`#toast-container`);
        if (element) {
            return element;
        }
    
        element = document.createElement('div');
        element.setAttribute('id', 'toast-container');
        element.classList.add('toast-container', 'position-fixed', 'pb-1', 'top-0', 'end-0', 'me-1', 'mt-1');
    
        const positionElement = document.createElement('div');
        positionElement.setAttribute('aria-live', 'polite');
        positionElement.setAttribute('aria-atomic', 'true');
        positionElement.classList.add('position-relative');
        positionElement.appendChild(element);
        document.body.appendChild(positionElement);
    
        return element;
    };

    const presentConfirm = (options) => {
        if (!options.handle || typeof options.handle !== 'function') {
            throw 'presentConfirm() require "handle" in options';
        }
    
        options = Object.assign({
            title       : 'Bạn có chắc thực hiện điều này?',
            cancelText  : 'Huỷ',
            cancelClass : 'btn-light',
            confirmText : 'Thực hiện',
            confirmClass: 'btn-primary'
        }, options);
    
        const buttonId = generateId('confirm');
    
        const content = `<div class="modal-content border-0">
            <div class="modal-header">
                <h1 class="modal-title fs-5">${options.title}</h1>
            </div>
            <div class="modal-body">${options.message}</div>
            <div class="modal-footer">
            <button type="button" class="btn ${options.cancelClass}" data-bs-dismiss="modal">${options.cancelText}</button>
            <button type="button" class="btn ${options.confirmClass}" data-bs-dismiss="modal" id="${buttonId}">${options.confirmText}</button>
            </div>
        </div>`;
    
        const modal = presentModal(content, {staticBackdrop: true});
        document.getElementById(buttonId).addEventListener('click', options.handle);
        return modal;
    };
})    