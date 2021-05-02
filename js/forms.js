function sendForm( f_formId ) {
    const form = document.getElementById( f_formId )

    const CheckFormClass = new CheckForm( form )

    return CheckFormClass.checkFormFields()

    // form.submit()
}

class CheckForm {

    _form = HTMLFormElement
    _checkForm = Boolean
    _formResult = Boolean

    constructor( form ) {
        this.form = form

        this.setCheckForm()
        if( this.checkForm === false ) {
            this.formResult = true
            return this.formResult
        }
    }


    get form() {
        return this._form
    }
    set form(value) {
        this._form = value
    }

    get checkForm() {
        return this._checkForm
    }
    set checkForm(value) {
        this._checkForm = value
    }

    get formResult() {
        return this._formResult
    }
    set formResult(value) {
        this._formResult = value
    }

    setCheckForm() {
        this.checkForm = this.form.getAttribute('data-js-form-check') === 'true'
    }

    checkFormFields() {
        const fields = this.form.querySelectorAll( '.form__field[data-js-form-field-check]' )
        Array.from( fields ).forEach( this.checkFormField )
        return false
    }

    checkFormField( field ) {
        const CheckFormFieldClass = new CheckFormField( field )
    }

}

class CheckFormField {

    _field = HTMLElement
    _fieldType = String
    _fieldTypes = [
        { 'name': 'text', 'class': 'form__field-text' },
        { 'name': 'radios', 'class': 'form__field-radios' },
        { 'name': 'checkboxes', 'class': 'form__field-checkboxes' },
        { 'name': 'checkbox', 'class': 'form__field-checkbox' }
    ]
    _fieldCheckTypes = []
    _fieldStatusText = String
    _fieldResult = Boolean

    constructor( field ) {
        this.field = field

        this.setFieldType()
        this.setFieldCheckTypes()

        console.log( this )
    }

    get field() {
        return this._field
    }
    set field(value) {
        this._field = value
    }

    get fieldType() {
        return this._fieldType
    }
    set fieldType(value) {
        this._fieldType = value
    }

    get fieldTypes() {
        return this._fieldTypes
    }
    set fieldTypes(value) {
        this._fieldTypes = value
    }

    get fieldCheckTypes() {
        return this._fieldCheckTypes
    }
    set fieldCheckTypes(value) {
        this._fieldCheckTypes = value
    }

    get fieldStatusText() {
        return this._fieldStatusText
    }
    set fieldStatusText(value) {
        this._fieldStatusText = value
    }

    get fieldResult() {
        return this._fieldResult
    }
    set fieldResult(value) {
        this._fieldResult = value
    }

    setFieldType() {

        for( let fieldType of this.fieldTypes ) {
            if( this.field.classList.contains( fieldType.class ) ) {
                this.fieldType = fieldType.name
                return true
            }
        }
        return false

    }

    setFieldCheckTypes() {

        const checks = this.field.getAttribute( 'data-js-form-field-check' ).split( ';' )
        for( let check of checks ) {
            this.addFieldCheckType( check )
        }

    }
    addFieldCheckType( checkType ) {

        const fieldCheckTypeName = checkType.split( ':' )[0]
        const fieldCheckTypeValue = checkType.split( ':' )[1]

        let fieldCheckTypes = this.fieldCheckTypes
        fieldCheckTypes.push( { 'name': fieldCheckTypeName, 'value': fieldCheckTypeValue } )
        this.fieldCheckTypes = fieldCheckTypes

    }

}