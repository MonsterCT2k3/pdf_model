$(document).ready(function() {
    $('.change-password').click(function () {
        $('#pass-modal').modal('show');
    })

    $('#change-password-form').submit(function (event) {
        var oldPassword = $('#old_pass').val();
        var newPassword = $('#new_pass').val();
        var confirmPassword = $('#confirm_pass').val();
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/change-password',
            data: {
                old_pass: oldPassword,
                new_pass: newPassword,
                confirm_pass: confirmPassword
            },
            success: function(response) {
                if (response.error) {
                    presentToast(response.error, 'danger')
                } else {
                    $('#pass-modal').modal('hide');
                    presentToast('Thay đổi mật khẩu thành công!', 'success');
                }
            },
            error: function(xhr, status, error) {   
                console.log(error);
            }
        });
    });

    $('#uploadForm').submit(function (event) {
        if($(".error-message")) {
            $(".error-message").remove();
        }
        event.preventDefault();
        $('#loading').show();
        var formData = new FormData($(this)[0]);
        $.ajax({
            url: '/predict',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if(response.error) {
                    error = document.getElementById("prediction")
                    error.innerHTML = '<p class="alert alert-danger error-message">' + response.error + '</p>'
                } else {
                    var modalResult = document.getElementById("modalResult");
                    var featureItem = document.querySelector(".feature-item");
                    featureItem.innerHTML = '';

                    response.feature[0].forEach(function(value, index) {
                        var row = '<td>' + value + '</td>';
                        featureItem.innerHTML += row;
                    });

                    if(response.result === 'no') {
                        modalResult.innerHTML = '<div class="notification">' +
                            '<span class="badge rounded-pill text-bg-success p-2">File an toàn</span>' +
                            '<p class="module mt-2">Mô hình: '+ response.module +'</p>' +
                            '<p class="acs">Độ chính xác (Accuracy): ' + response.acs + '%</p></div>' +
                            '<p class="precision">Độ chính xác (Precision): ' + response.precision + '%</p></div>' +
                            '<p class="recall">Độ nhạy: ' + response.recall + '%</p></div>' +
                            '<p class="f1">F1 Score: ' + response.f1 + '%</p></div>';
                    } else {
                        modalResult.innerHTML = '<div class="notification">' +
                            '<span class="badge rounded-pill text-bg-danger p-2">File có mã độc</span>' +
                            '<p class="module mt-2">Mô hình: '+ response.module +'</p>' +
                            '<p class="acs">Độ chính xác (Accuracy): ' + response.acs + '%</p></div>' +
                            '<p class="precision">Độ chính xác (Precision): ' + response.precision + '%</p></div>' +
                            '<p class="recall">Độ nhạy: ' + response.recall + '%</p></div>' +
                            '<p class="f1">F1 Score: ' + response.f1 + '%</p></div>';
                    }
                    $('#resultModal').modal('show');
                }
            },
            error: function (error) {
                console.log(error);
            },
            complete: function() {
                $('#loading').hide();
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
});