const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

const productForm = document.getElementById("product-form");
const formMessage = document.getElementById("form-message");

const adminProducts = document.getElementById("admin-products");

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

const displayStyleInput =
  document.getElementById("display-style");


/* ========================================
   DASHBOARD
======================================== */

function showDashboard() {

  loginSection.classList.add("hidden");

  dashboard.classList.remove("hidden");

  loadAdminProducts();
}


function showLogin() {

  dashboard.classList.add("hidden");

  loginSection.classList.remove("hidden");
}


/* ========================================
   LOAD ADMIN PRODUCTS
======================================== */

async function loadAdminProducts() {

  if (!supabaseClient) {

    adminProducts.innerHTML =
      '<p class="message">Configure Supabase in <code>js/config.js</code> to enable the admin panel.</p>';

    return;
  }


  const {
    data,
    error
  } = await supabaseClient

    .from("products")

    .select("*")

    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(error);

    adminProducts.innerHTML =
      `<p class="message">${escapeHtml(error.message)}</p>`;

    return;
  }


  adminProducts.innerHTML = data.length

    ? data.map(product => {

        const style =
          product.display_style || "black";


        return `

          <div class="admin-row">

            <img
              src="${escapeHtml(product.image_url)}"
              alt="${escapeHtml(product.name)}"
              class="admin-product-image ${escapeHtml(style)}"
            >


            <div>

              <h3>
                ${escapeHtml(product.name)}
              </h3>


              <small>
                ${escapeHtml(product.category)}

                ${
                  product.weight
                    ? " · " + escapeHtml(product.weight)
                    : ""
                }
              </small>


              <small class="admin-style">
                Style:
                ${escapeHtml(style)}
              </small>

            </div>


            <strong class="price">
              ${euro(product.price)}
            </strong>


            <div class="admin-actions">

              <button
                class="outline-button"
                onclick='editProduct(${JSON.stringify(product)})'
              >
                Edit
              </button>


              <button
                class="outline-button danger"
                onclick="deleteProduct('${escapeHtml(product.id)}')"
              >
                Delete
              </button>

            </div>

          </div>

        `;

      }).join("")

    : '<p class="message">No products yet.</p>';
}


/* ========================================
   LOGIN
======================================== */

loginForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (!supabaseClient) {

      loginMessage.textContent =
        "Configure Supabase in js/config.js first.";

      return;
    }


    loginMessage.textContent =
      "Signing in...";


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    const {
      error
    } =
      await supabaseClient.auth.signInWithPassword({

        email,

        password

      });


    if (error) {

      loginMessage.textContent =
        error.message;

      return;
    }


    loginMessage.textContent = "";

    showDashboard();

  }
);


/* ========================================
   LOGOUT
======================================== */

document
  .getElementById("logout-btn")
  .addEventListener(
    "click",
    async () => {

      if (supabaseClient) {

        await supabaseClient.auth.signOut();

      }

      showLogin();

    }
  );


/* ========================================
   IMAGE PREVIEW
======================================== */

imageInput.addEventListener(
  "change",
  () => {

    const file =
      imageInput.files[0];


    if (!file) {

      imagePreview.innerHTML = "";

      imagePreview.classList.add("hidden");

      return;
    }


    const imageUrl =
      URL.createObjectURL(file);


    imagePreview.innerHTML = `

      <img
        src="${imageUrl}"
        alt="Preview"
      >

    `;


    imagePreview.classList.remove("hidden");

  }
);


/* ========================================
   ADD / EDIT PRODUCT
======================================== */

productForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (!supabaseClient) {

      formMessage.textContent =
        "Configure Supabase first.";

      return;
    }


    const id =
      document
        .getElementById("product-id")
        .value;


    const file =
      imageInput.files[0];


    const name =
      document
        .getElementById("name")
        .value
        .trim();


    const category =
      document
        .getElementById("category")
        .value;


    const weight =
      document
        .getElementById("weight")
        .value
        .trim();


    const price =
      Number(
        document
          .getElementById("price")
          .value
      );


    const description =
      document
        .getElementById("description")
        .value
        .trim();


    const displayStyle =
      displayStyleInput
        ? displayStyleInput.value
        : "black";


    formMessage.textContent =
      "Saving...";


    try {

      let imageUrl = null;


      /* ========================================
         IMAGE UPLOAD
      ======================================== */

      if (file) {

        const safeName =
          file.name
            .toLowerCase()
            .replace(
              /[^a-z0-9._-]/g,
              "-"
            );


        const path =
          `${crypto.randomUUID()}-${safeName}`;


        const {
          error: uploadError
        } =
          await supabaseClient

            .storage

            .from("product-images")

            .upload(
              path,
              file,
              {
                upsert: false
              }
            );


        if (uploadError) {

          throw uploadError;

        }


        const {
          data
        } =
          supabaseClient

            .storage

            .from("product-images")

            .getPublicUrl(path);


        imageUrl =
          data.publicUrl;

      }


      /* ========================================
         PRODUCT DATA
      ======================================== */

      const payload = {

        name,

        category,

        weight,

        price,

        description,

        display_style: displayStyle

      };


      /* ========================================
         EDIT EXISTING PRODUCT
      ======================================== */

      if (id) {


        /*
          Only update image_url when
          a new image was selected.
        */

        if (imageUrl) {

          payload.image_url =
            imageUrl;

        }


        const {
          error
        } =
          await supabaseClient

            .from("products")

            .update(payload)

            .eq("id", id);


        if (error) {

          throw error;

        }

      }


      /* ========================================
         ADD NEW PRODUCT
      ======================================== */

      else {


        if (!imageUrl) {

          throw new Error(
            "Please choose a product image."
          );

        }


        payload.image_url =
          imageUrl;


        const {
          error
        } =
          await supabaseClient

            .from("products")

            .insert(payload);


        if (error) {

          throw error;

        }

      }


      /* ========================================
         SUCCESS
      ======================================== */

      formMessage.textContent =
        "Product saved successfully.";


      resetForm();


      await loadAdminProducts();

    }


    catch (error) {

      console.error(error);


      formMessage.textContent =
        error.message ||
        "Something went wrong.";

    }

  }
);


/* ========================================
   EDIT PRODUCT
======================================== */

window.editProduct =
  function(product) {


    document
      .getElementById("product-id")
      .value =
        product.id;


    document
      .getElementById("name")
      .value =
        product.name || "";


    document
      .getElementById("category")
      .value =
        product.category || "Other";


    document
      .getElementById("weight")
      .value =
        product.weight || "";


    document
      .getElementById("price")
      .value =
        product.price ?? "";


    document
      .getElementById("description")
      .value =
        product.description || "";


    /* ========================================
       DISPLAY STYLE
    ======================================== */

    if (displayStyleInput) {

      displayStyleInput.value =
        product.display_style || "black";

    }


    /* ========================================
       FORM TITLE
    ======================================== */

    document
      .getElementById("form-heading")
      .textContent =
        "Edit Product";


    document
      .getElementById("cancel-edit")
      .classList
      .remove("hidden");


    /* ========================================
       IMAGE OPTIONAL DURING EDIT
    ======================================== */

    imageInput.required = false;


    /* ========================================
       CURRENT IMAGE
    ======================================== */

    imagePreview.innerHTML = `

      <img
        src="${escapeHtml(product.image_url)}"
        alt="${escapeHtml(product.name)}"
      >

    `;


    imagePreview.classList.remove(
      "hidden"
    );


    /* ========================================
       SCROLL TO FORM
    ======================================== */

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


/* ========================================
   DELETE PRODUCT
======================================== */

window.deleteProduct =
  async function(id) {


    if (
      !confirm(
        "Delete this product?"
      )
    ) {

      return;

    }


    if (!supabaseClient) {

      alert(
        "Supabase is not configured."
      );

      return;

    }


    const {
      error
    } =
      await supabaseClient

        .from("products")

        .delete()

        .eq("id", id);


    if (error) {

      alert(error.message);

      return;

    }


    await loadAdminProducts();

  };


/* ========================================
   CANCEL EDIT
======================================== */

document
  .getElementById("cancel-edit")
  .addEventListener(
    "click",
    resetForm
  );


/* ========================================
   RESET FORM
======================================== */

function resetForm() {


  productForm.reset();


  document
    .getElementById("product-id")
    .value = "";


  document
    .getElementById("form-heading")
    .textContent =
      "Add Product";


  document
    .getElementById("cancel-edit")
    .classList
    .add("hidden");


  imageInput.required = true;


  imagePreview.classList
    .add("hidden");


  imagePreview.innerHTML = "";


  /* ========================================
     DEFAULT DISPLAY STYLE
  ======================================== */

  if (displayStyleInput) {

    displayStyleInput.value =
      "black";

  }


  formMessage.textContent = "";

}


/* ========================================
   SECURITY / HTML ESCAPING
======================================== */

function escapeHtml(value) {

  return String(value ?? "")

    .replace(
      /[&<>"']/g,

      character => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#039;"

      }[character])

    );

}


/* ========================================
   AUTH SESSION
======================================== */

(async () => {


  if (!supabaseClient) {

    return;

  }


  const {
    data: {
      session
    }
  } =
    await supabaseClient.auth.getSession();


  if (session) {

    showDashboard();

  }

})();