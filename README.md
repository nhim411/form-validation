# Form validation library

Form validation library is a javascript library for validate input form.

## Installation

import `validator.js` to your code
## Usage

```javascript
Validator({
  form: "#form-id",
  errorSelector: ".form-message",
  formGroupSelector: ".form-group",
  rules: [
    // Define rules
    // Validator.isRequired available for input:text, password,checkbox,select, file
    // Validator.isEmail available for validating email input
    // Validator.minLength check length of string
    // onSubmit function: option, if onsubmit function is not defined, use default submit of browser
    Validator.isRequired("#fullname", "Vui lòng nhập tên đầy đủ của bạn"),
    //isRequired(selector, error message: optional)
    Validator.isEmail("#email"),
    Validator.minLength("#password", 6),
    Validator.isConfirmed(
      "#password_confirmation",
      function () {
        return document.querySelector("#form-1 #password").value;
      },
      "Mật khẩu nhập lại không chính xác"
    ),
  ],
  onSubmit: function (data) {
    console.log(data);
  },
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)