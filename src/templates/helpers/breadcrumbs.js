module.exports = function () {
    var items = '<li><a href="/" class="text-blue font-bold">Homepage</a></li>';
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length - 2; i += 2) {
            var title = arguments[i];
            var path = arguments[i + 1];

            items += `<li><span class="mx-2">/</span></li><li><a href="${path}" class="text-blue font-bold">${title}</a></li>`;
        }

        items += `<li><span class="mx-2">/</span></li><li>${arguments[0]}</li>`;
    }
    return `<nav class="bg-grey-light p-3 rounded font-sans w-full m-4">
    <ol class="list-reset flex text-grey-dark">
        ${items}
    </ol>
</nav>`;
};
