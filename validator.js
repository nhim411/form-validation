const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Constructor function
function Validator(options) {
  const selectorRules = {};

  // function getParent(element, selector) {
  //   while (element.parentElement) {
  //     if (element.parentElement.matches(selector)) {
  //       return element.parentElement;
  //     }
  //     element = element.parentElement;
  //   }
  // }

  //Ham thuc hien validate
  function validate(inputElement, rule) {
    let parentElement = inputElement.closest(options.formGroupSelector);
    let errorElement = parentElement.querySelector(options.errorSelector);
    let errorMessage;

    // Lấy ra các rule của selector
    const rules = selectorRules[rule.selector];

    // Lặp qua từng rule và kiểm tra
    // Nếu có lỗi thì dừng việc kiểm tra
    for (let i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"));

          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }

      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  }

  //Lay element cua form can validate
  const formElement = $(options.form);

  if (formElement) {
    // Kiểm tra các input khi submit
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValid = true;

      // Lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        // Submit với javascipt (call API)
        if (typeof options.onSubmit === "function") {
          let enableInputs = formElement.querySelectorAll("[name]:not([disabled])");
          let formValue = Array.from(enableInputs).reduce((value, input) => {
            switch (input.type) {
              case "checkbox":
                if (input.matches(":checked")) {
                  if (!Array.isArray(value[input.name])) {
                    value[input.name] = [];
                  }
                  value[input.name].push(input.value);
                } else if (!value[input.name]) {
                  value[input.name] = "";
                }
                break;
              case "radio":
                if (input.matches(":checked")) {
                  value[input.name] = input.value;
                } else if (!value[input.name]) {
                  value[input.name] = "";
                }
                break;
              case "file":
                value[input.name] = input.files;
                break;
              default:
                value[input.name] = input.value;
            }
            return value;
          }, {});
          options.onSubmit(formValue);
        } else {
          // Submit với hành vi mặc định của trình duyệt
          formElement.submit();
          p;
        }
      }
    };

    // Lặp qua mỗi rule và xử lý (onblur, oninput,...)
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach((inputElement) => {
        let parentElement = inputElement.closest(options.formGroupSelector);
        let errorElement = parentElement.querySelector(".form-message");
        if (inputElement) {
          inputElement.onblur = function () {
            validate(inputElement, rule);
          };

          inputElement.oninput = function () {
            errorElement.innerText = "";
            parentElement.classList.remove("invalid");
          };
        }
      });
    });
  }
}

//Define Rule
//Nguyen tac cac rule
//1. Co loi => tra ra loi, 2. Khong hop le => khong tra ra gi ca(undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector,
    test(value) {
      if (typeof value === "string") {
        return value.trim() ? undefined : message || "Vui lòng nhập trường này";
      } else {
        return value ? undefined : message || "Vui lòng nhập trường này";
      }
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector,
    test(value) {
      const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return regex.test(value) ? undefined : message || "Trường này phải là email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector,
    test(value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector,
    test(value) {
      return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác";
    },
  };
};
