sequenceDiagram
    participant browser
    participant server

    Note right of browser: El usuario accede a https://studies.cs.helsinki.fi/exampleapp/spa
    
    browser->>server: GET /spa
    activate server
    server-->>browser: HTML (SPA)
    deactivate server

    browser->>server: GET /main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET /spa.js
    activate server
    server-->>browser: JavaScript SPA
    deactivate server

    browser->>server: GET /data.json
    activate server
    server-->>browser: JSON con todas las notas
    deactivate server

    Note right of browser: El navegador renderiza las notas usando JavaScript y DOM API

    Note right of browser: El usuario escribe una nueva nota y pulsa "Save"

    browser->>server: POST /new_note_spa (JSON: {content, date})
    activate server
    Note right of server: El servidor agrega la nueva nota en memoria
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: El navegador actualiza la lista de notas dinámicamente sin recargar la página
