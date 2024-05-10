let products = []; // Array para armazenar os produtos
let totalPurchases = 0; // Variável para armazenar o total de compras
let totalSales = 0; // Variável para armazenar o total de vendas

const PaymentMethod = {
    PIX: 'Pix',
    CARTAO: 'Cartão',
    DINHEIRO: 'Dinheiro'
};

function addProduct() {
    // Obter dados do formulário
    const productName = document.getElementById('productName').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productCostPrice = document.getElementById('productCostPrice').value;
    const productSellingPrice = document.getElementById('productSellingPrice').value;
    const productImage = document.getElementById('productImage').files[0];
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Validar dados
    if (productName && productQuantity && productCostPrice && productSellingPrice && productImage) {
        // Criar objeto de produto
        const product = {
            name: productName,
            purchaseQuantity: parseInt(productQuantity), // Quantidade comprada
            saleQuantity: 0, // Quantidade vendida inicialmente definida como 0
            costPrice: parseFloat(productCostPrice),
            sellingPrice: parseFloat(productSellingPrice),
            purchaseHistory: [],
            saleHistory: [],
            image: URL.createObjectURL(productImage),
            paymentMethod: paymentMethod
        };

         // Carregar produtos existentes do localStorage
        const existingProducts = loadProducts();

        // Adicionar produto ao array
        products.push(product);

        // Adicionar a compra atual ao histórico
        addToPurchaseHistory(product, product.purchaseQuantity, paymentMethod);

        // Salvar produtos atualizados no localStorage
        saveProducts(existingProducts);

        // Atualizar a lista de produtos na página
        displayProducts();

        // Limpar o formulário
        document.getElementById('productName').value = '';
        document.getElementById('productQuantity').value = '';
        document.getElementById('productCostPrice').value = '';
        document.getElementById('productSellingPrice').value = '';
        document.getElementById('productImage').value = '';
    } else {
        alert('Preencha todos os campos do formulário.');
    }
}

function addToPurchaseHistory(product, quantity, payment) {
    // Adicionar compra ao histórico
    const purchase = {
        date: new Date().toLocaleString(),
        quantity: quantity,
        payment: payment
    };

    product.purchaseHistory.push(purchase);
}

function displayProducts() {
    // Obter a div onde os produtos serão exibidos
    const productListDiv = document.getElementById('productList');

    // Limpar a lista atual
    productListDiv.innerHTML = '';

    // Resetar o total de compras e vendas
    totalPurchases = 0;
    totalSales = 0;

    // Criar elementos para cada produto e adicioná-los à div
    products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add('catalog-item');

        // Adicionar nome do produto em destaque
        const productNameHeader = document.createElement('h2');
        productNameHeader.textContent = product.name;
        productElement.appendChild(productNameHeader);

        // Adicionar imagem ao elemento do produto
        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;
        productImage.classList.add('product-image'); // Adicionar classe para aplicar estilos
        productElement.appendChild(productImage);

        // Adicionar informações abaixo do nome do produto
        const productInfo = document.createElement('p');
        productInfo.textContent = `Quantidade Comprada: ${product.purchaseQuantity} - Quantidade Vendida: ${product.saleQuantity} - Preço de Compra: $${product.costPrice.toFixed(2)} - Preço de Venda: $${product.sellingPrice.toFixed(2)}`;

        // Calcular o lucro para este produto
        const profit = (product.sellingPrice - product.costPrice) * product.saleQuantity;
        totalPurchases += product.costPrice * product.purchaseQuantity;
        totalSales += profit;

        // Adicionar campo de edição de quantidade
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 0;  // Inicializa com zero
        quantityInput.min = '0';
        quantityInput.classList.add('quantity-input');
        productInfo.appendChild(quantityInput);

        // Adicionar botão de adição
        const addButton = document.createElement('button');
        addButton.textContent = 'Compra';
        addButton.addEventListener('click', () => addQuantity(index, parseInt(quantityInput.value)));  // Alteração aqui
        productInfo.appendChild(addButton);

        // Adicionar botão de subtração
        const subtractButton = document.createElement('button');
        subtractButton.textContent = 'Venda';
        subtractButton.addEventListener('click', () => subtractQuantity(index, parseInt(quantityInput.value)));  // Alteração aqui
        productInfo.appendChild(subtractButton);

        // Adicionar botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', () => deleteProduct(index));
        productInfo.appendChild(deleteButton);

        productElement.appendChild(productInfo);

        // Adicionar histórico de compra ao elemento do produto
        product.purchaseHistory.forEach(purchase => {
            const purchaseElement = document.createElement('p');
            purchaseElement.textContent = `Compra em ${purchase.date}, Quantidade: ${purchase.quantity}`;
            productElement.appendChild(purchaseElement);
        });

        // Adicionar histórico de venda ao elemento do produto
        product.saleHistory.forEach(sale => {
            const saleElement = document.createElement('p');
            saleElement.textContent = `Venda em ${sale.date}, Quantidade: ${sale.quantity}, Lucro: $${((sale.sellingPrice - product.costPrice) * sale.quantity).toFixed(2)}`;
            productElement.appendChild(saleElement);
        });

        productListDiv.appendChild(productElement);
    });

    // Exibir o total de compras e vendas
    const totalPurchasesElement = document.createElement('p');
    totalPurchasesElement.textContent = `Total de Compras: $${totalPurchases.toFixed(2)}`;
    productListDiv.appendChild(totalPurchasesElement);

    const totalSalesElement = document.createElement('p');
    totalSalesElement.textContent = `Total de Lucro: $${totalSales.toFixed(2)}`;
    productListDiv.appendChild(totalSalesElement);
}

function updatePurchaseQuantity(index, newQuantity) {
    if (newQuantity >= 0) {
        const product = products[index];
        const currentPurchaseQuantity = product.purchaseQuantity;

        // Atualizar a quantidade comprada
        const quantityDifference = newQuantity - currentPurchaseQuantity;
        addPurchaseHistory(product, quantityDifference);

        // Exibir o estado atualizado
        displayProducts();
    } else {
        alert('A quantidade de compra não pode ser negativa.');
    }
}

function updateQuantity(index, newQuantity) {
    if (newQuantity) {
        const product = products[index];
        const currentQuantity = product.quantity;

        // Atualizar a quantidade no estoque
        const quantityDifference = newQuantity - currentQuantity;

        updateProductQuantity(product, quantityDifference);

        // Exibir o estado atualizado
        console.log('Quantidade Atualizada:', product.quantity);

        // Atualizar a exibição
        displayProducts();
    } else {
        alert('A quantidade não pode ser negativa.');
    }
}

function deleteProduct(index) {
    if (confirm('Tem certeza de que deseja excluir este produto?')) {
        products.splice(index, 1);
        displayProducts();
    }
}

function addQuantity(index, quantity, paymentMethod) {
    const product = products[index];
    if (quantity > 0) {
        product.purchaseQuantity += quantity;
        addPurchaseHistory(product, quantity, paymentMethod);
        displayProducts();
    } else {
        alert('A quantidade a ser adicionada deve ser maior que zero.');
    }
}

// Função para carregar produtos do localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

// Função para salvar produtos no localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function subtractQuantity(index, quantity, paymentMethod) {
    const product = products[index];
    if (quantity > 0 && quantity <= product.purchaseQuantity - product.saleQuantity) {
        product.saleQuantity += quantity;

        // Adiciona à história de venda com o método de pagamento
        const sale = {
            date: new Date().toLocaleString(),
            quantity: quantity,
            sellingPrice: product.sellingPrice,
            paymentMethod: paymentMethod
        };

        product.saleHistory.push(sale);

        // Atualiza o lucro total
        const profit = (product.sellingPrice - product.costPrice) * quantity;
        totalSales += profit;

        displayProducts();
    } else {
        alert('Quantidade inválida para venda.');
    }
}

function addPurchaseHistory(product, quantity, paymentMethod) {
    const purchase = {
        date: new Date().toLocaleString(),
        quantity: quantity,
        paymentMethod: paymentMethod  // Adiciona o método de pagamento
    };

    product.purchaseHistory.push(purchase);
}

function subtractPurchaseHistory(product, quantity, paymentMethod) {
    const purchase = {
        date: new Date().toLocaleString(),
        quantity: -quantity,  // Quantidade negativa para indicar subtração
        paymentMethod: paymentMethod  // Adiciona o método de pagamento
    };

    product.purchaseHistory.push(purchase);
}
