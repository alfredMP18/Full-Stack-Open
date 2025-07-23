sequenceDiagram
    participant browser
    participant server

    Note right of browser: El usuario escribe una nueva nota y hace clic en "Save"
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note (form data)
    activate server
    Note right of server: El servidor guarda la nueva nota en memoria y responde con una redirección
    server-->>browser: 302 Redirect (Location: /notes)
    deactivate server

    Note right of browser: El navegador sigue la redirección y recarga la página de notas

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML actualizado
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: JSON con todas las notas (incluyendo la nueva)
    deactivate server

    Note right of browser: El navegador ejecuta el JavaScript y vuelve a renderizar la lista de notas
