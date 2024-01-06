    M.Sidenav.init(document.querySelector('.sidenav'))
      M.FormSelect.init(document.querySelector('#status'))

      document.addEventListener('DOMContentLoaded', function() {
        let elems = document.querySelectorAll('.modal');
        let instances = M.Modal.init(elems);
    });

    let instances = M.Modal.init(document.querySelectorAll('.modal'));

    //tooltip initilization 
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);
      });

    // Event listener for modal trigger
    document.querySelectorAll('.modal-trigger').forEach(function(el) {
        el.addEventListener('click', function() {
            const inventoryId = el.getAttribute('data-id');
            const form = document.getElementById('wasteLogForm')
            form.setAttribute('data-id', inventoryId)
            form.action  = `api/inventory/name/${inventoryId}`

            fetch('/api/inventory/name/' + inventoryId)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json()
            })
            .then(data => {
                console.log(data);
                const wasteName = document.getElementById('wasteName')
                wasteName.value = data.product

                if(data.pintsMade || data.quartsMade){
                    const qrtsMadeDiv = document.getElementById('input-div')
                    const qrtsLostInput = document.getElementById('quantity')
                    const qrtsLostLabel = document.getElementById('quantityLabel')
                    qrtsLostLabel.innerHTML = 'Quarts Lost'
                    qrtsLostInput.name = 'quartsLost'
                    qrtsLostLabel.for = 'quartsLost'
                    const div = document.createElement('div')
                    div.classList.add('input-field')
                    const pintsLostInput = document.createElement('input')
                    const pintsLostLabel = document.createElement('label')
                    pintsLostInput.type = 'number'
                    pintsLostInput.name = 'pintsLost'
                    pintsLostLabel.for = 'pintsLost'
                    pintsLostLabel.innerHTML = 'Pints Lost'

                    qrtsMadeDiv.append(div)

                    div.appendChild(pintsLostInput)
                    div.appendChild(pintsLostLabel)

                }
            })
        })
    });

function submitWasteLogForm() {
    // Handle form submission logic here
    var selectedQuantity = document.getElementById('quantitySelect').value;
    console.log('Selected Quantity:', selectedQuantity);

    // You can now make a request to delete the item from the inventory using the selected quantity
    // Include your logic to make the DELETE request to your server endpoint
    // Example: fetch('/api/inventory/' + inventoryId, { method: 'DELETE' })
}