import { useEffect } from "react";
import { createRoot } from "react-dom/client";

class MenuBarHelpers {
    static renderMenuComponent(component: React.ReactNode) {
        const container = document.createElement('div');
        const root = createRoot(container);
    
        useEffect(() => {
            root.render(component);
        }, [component]);
    
        return container;
    }
}

export default MenuBarHelpers;
