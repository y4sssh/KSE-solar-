import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function CanvasWrapper(props: any) {
    const ref = useRef<HTMLDivElement>(null);
    // Unmount when scrolled far away to free up WebGL contexts
    const inView = useInView(ref, { margin: "200px" });

    return (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            {inView && <Canvas {...props} />}
        </div>
    );
}
