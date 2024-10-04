export const presentToast = (message, options) => {
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