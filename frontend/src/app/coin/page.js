import ThreeScene from "../components/ThreeScene";

export default function coin() {
    const props = { l1: 0xFFD1DC, l2: 0xAEC6CF, l3: 0xB39EB5, r1: 0xBFD3C1, r2: 0xFFF5B2, r3: 0xFFB347, date: '2023/10/20', num: '#000' };
    return (
        <div>
            <ThreeScene props={props} />
        </div>
    );
}
