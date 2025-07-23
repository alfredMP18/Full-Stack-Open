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


