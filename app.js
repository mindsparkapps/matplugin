/* ============================
   MathViz 3D — Main Application
   Three.js + Math.js
   ============================ */

(function () {
    'use strict';

    // ─── Constants ─────────────────────────────
    const COLORS = {
        original: 0x6C63FF,
        derivative: 0xFF6B9D,
        integral: 0x00D4AA,
        tangent: 0xFFA751,
        grid: 0x1a1a2e,
        axes: 0x3a3a55,
        areaFill: 0x00D4AA,
        background: 0x0a0a0f,
        labelX: 0x6C63FF,
        labelY: 0xFF6B9D,
    };

    const LINE_WIDTH_BASE = 3;
    const TANGENT_LENGTH = 4;
    const Y_CLAMP = 50;

    // ─── State ─────────────────────────────────
    const state = {
        fnExpr: 'x^3 - 3*x',
        compiledFn: null,
        derivativeExpr: '',
        xMin: -8,
        xMax: 8,
        resolution: 500,
        showOriginal: true,
        showDerivative: true,
        showIntegral: true,
        showTangent: false,
        showGrid: false,
        showAxes: true,
        showArea: false,
        areaA: -2,
        areaB: 2,
        tangentX: 1,
        animating: false,
    };

    // ─── Three.js Setup ────────────────────────
    let scene, camera, renderer, controls;
    let curveOriginal, curveDerivative, curveIntegral;
    let tangentLine, tangentPoint;
    let gridGroup, axesGroup, labelsGroup;
    let areaMesh;
    let animationId;

    function initThree() {
        const canvas = document.getElementById('three-canvas');

        scene = new THREE.Scene();
        scene.background = new THREE.Color(COLORS.background);

        // Add subtle fog for depth
        scene.fog = new THREE.FogExp2(COLORS.background, 0.008);

        // Camera — orthographic-like perspective for 2D graph feel
        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.set(0, 0, 22);

        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // OrbitControls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.zoomSpeed = 1.2;
        controls.minDistance = 5;
        controls.maxDistance = 80;

        // Ambient particles
        createParticles();

        // Axes & Grid
        createAxes();
        createGrid();

        // Handle resize
        window.addEventListener('resize', onResize);
    }

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    // ─── Background Particles ──────────────────
    function createParticles() {
        const count = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.06,
            color: 0x4444aa,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        particles.name = 'particles';
        scene.add(particles);
    }

    // ─── Grid ──────────────────────────────────
    function createGrid() {
        gridGroup = new THREE.Group();
        gridGroup.name = 'grid';
        gridGroup.visible = state.showGrid;

        const gridSize = 20;
        const gridMaterial = new THREE.LineBasicMaterial({
            color: COLORS.grid,
            transparent: true,
            opacity: 0.4,
        });

        for (let i = -gridSize; i <= gridSize; i++) {
            // Vertical lines
            const vGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, -gridSize, -0.1),
                new THREE.Vector3(i, gridSize, -0.1),
            ]);
            gridGroup.add(new THREE.Line(vGeo, gridMaterial));

            // Horizontal lines
            const hGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-gridSize, i, -0.1),
                new THREE.Vector3(gridSize, i, -0.1),
            ]);
            gridGroup.add(new THREE.Line(hGeo, gridMaterial));
        }

        scene.add(gridGroup);
    }

    // ─── Axes ──────────────────────────────────
    function createAxes() {
        axesGroup = new THREE.Group();
        axesGroup.name = 'axes';

        // X axis
        const xMat = new THREE.LineBasicMaterial({ color: 0x555588, linewidth: 1 });
        const xGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-30, 0, 0),
            new THREE.Vector3(30, 0, 0),
        ]);
        axesGroup.add(new THREE.Line(xGeo, xMat));

        // Y axis
        const yMat = new THREE.LineBasicMaterial({ color: 0x555588, linewidth: 1 });
        const yGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -30, 0),
            new THREE.Vector3(0, 30, 0),
        ]);
        axesGroup.add(new THREE.Line(yGeo, yMat));

        // Tick marks and labels
        createTickMarks();

        // Arrow heads
        createArrowHead(axesGroup, new THREE.Vector3(30, 0, 0), new THREE.Vector3(1, 0, 0), 0x555588);
        createArrowHead(axesGroup, new THREE.Vector3(0, 30, 0), new THREE.Vector3(0, 1, 0), 0x555588);

        scene.add(axesGroup);
    }

    function createArrowHead(group, position, direction, color) {
        const size = 0.3;
        const geo = new THREE.ConeGeometry(size * 0.5, size, 8);
        const mat = new THREE.MeshBasicMaterial({ color });
        const cone = new THREE.Mesh(geo, mat);
        cone.position.copy(position);

        if (direction.x > 0) {
            cone.rotation.z = -Math.PI / 2;
        }
        // Y direction is default (up)

        group.add(cone);
    }

    function createTickMarks() {
        const tickMat = new THREE.LineBasicMaterial({
            color: 0x444466,
            transparent: true,
            opacity: 0.6,
        });

        for (let i = -20; i <= 20; i++) {
            if (i === 0) continue;

            const tickSize = (i % 5 === 0) ? 0.25 : 0.12;

            // X axis ticks
            const xTickGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, -tickSize, 0),
                new THREE.Vector3(i, tickSize, 0),
            ]);
            axesGroup.add(new THREE.Line(xTickGeo, tickMat));

            // Y axis ticks
            const yTickGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-tickSize, i, 0),
                new THREE.Vector3(tickSize, i, 0),
            ]);
            axesGroup.add(new THREE.Line(yTickGeo, tickMat));

            // Number labels for major ticks
            if (i % 2 === 0 && Math.abs(i) <= 10) {
                createTextSprite(i.toString(), new THREE.Vector3(i, -0.6, 0), 0.4, 0x666688);
                if (i !== 0) {
                    createTextSprite(i.toString(), new THREE.Vector3(-0.6, i, 0), 0.4, 0x666688);
                }
            }
        }

        // Axis labels
        createTextSprite('x', new THREE.Vector3(11, -0.6, 0), 0.6, COLORS.labelX);
        createTextSprite('y', new THREE.Vector3(-0.7, 11, 0), 0.6, COLORS.labelY);
    }

    function createTextSprite(text, position, scale, color) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;

        ctx.font = 'bold 40px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const hexColor = '#' + new THREE.Color(color).getHexString();
        ctx.fillStyle = hexColor;
        ctx.fillText(text, 64, 32);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;

        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
        });

        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(position);
        sprite.scale.set(scale, scale * 0.5, 1);
        axesGroup.add(sprite);
    }

    // ─── Math Functions ────────────────────────
    function compileFn(expr) {
        try {
            const node = math.parse(expr);
            const compiled = node.compile();
            // Test evaluation
            compiled.evaluate({ x: 0 });
            return compiled;
        } catch (e) {
            return null;
        }
    }

    function evalFn(compiled, x) {
        try {
            const y = compiled.evaluate({ x });
            if (!isFinite(y)) return NaN;
            return Math.max(-Y_CLAMP, Math.min(Y_CLAMP, y));
        } catch {
            return NaN;
        }
    }

    function numericalDerivative(compiled, x, h = 0.0001) {
        const y1 = evalFn(compiled, x + h);
        const y2 = evalFn(compiled, x - h);
        if (isNaN(y1) || isNaN(y2)) return NaN;
        return (y1 - y2) / (2 * h);
    }

    function numericalIntegral(compiled, xValues) {
        // Simpson's rule cumulative integral
        const integral = [0];
        for (let i = 1; i < xValues.length; i++) {
            const h = xValues[i] - xValues[i - 1];
            const y0 = evalFn(compiled, xValues[i - 1]);
            const y1 = evalFn(compiled, xValues[i]);
            const yMid = evalFn(compiled, (xValues[i - 1] + xValues[i]) / 2);

            if (isNaN(y0) || isNaN(y1) || isNaN(yMid)) {
                integral.push(integral[integral.length - 1]);
            } else {
                integral.push(integral[integral.length - 1] + (h / 6) * (y0 + 4 * yMid + y1));
            }
        }
        return integral;
    }

    function computeDefiniteIntegral(compiled, a, b, n = 1000) {
        const h = (b - a) / n;
        let sum = evalFn(compiled, a) + evalFn(compiled, b);

        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            const y = evalFn(compiled, x);
            if (isNaN(y)) continue;
            sum += (i % 2 === 0 ? 2 : 4) * y;
        }

        return (h / 3) * sum;
    }

    function getSymbolicDerivative(expr) {
        try {
            const derivative = math.derivative(expr, 'x');
            return derivative.toString();
        } catch {
            return 'numérica';
        }
    }

    // ─── Curve Generation ──────────────────────
    function generateCurvePoints(evalCallback, xMin, xMax, resolution) {
        const points = [];
        const step = (xMax - xMin) / resolution;

        for (let i = 0; i <= resolution; i++) {
            const x = xMin + i * step;
            const y = evalCallback(x);

            if (!isNaN(y) && isFinite(y)) {
                points.push(new THREE.Vector3(x, y, 0));
            } else if (points.length > 0) {
                // Break: push NaN marker (handled by creating segments)
                points.push(null);
            }
        }

        return points;
    }

    function createCurveFromPoints(points, color, width = LINE_WIDTH_BASE) {
        const group = new THREE.Group();

        // Split points at null markers into segments
        const segments = [];
        let current = [];
        for (const p of points) {
            if (p === null) {
                if (current.length >= 2) segments.push(current);
                current = [];
            } else {
                current.push(p);
            }
        }
        if (current.length >= 2) segments.push(current);

        for (const seg of segments) {
            // Main line
            const geometry = new THREE.BufferGeometry().setFromPoints(seg);
            const material = new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity: 0.95,
            });
            const line = new THREE.Line(geometry, material);
            group.add(line);

            // Glow effect — slightly wider, more transparent
            const glowMaterial = new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity: 0.2,
            });
            const glowLine = new THREE.Line(geometry.clone(), glowMaterial);
            glowLine.position.z = -0.01;
            group.add(glowLine);
        }

        return group;
    }

    // ─── Render Curves ─────────────────────────
    function removeCurves() {
        ['curveOriginal', 'curveDerivative', 'curveIntegral', 'tangentGroup', 'areaGroup'].forEach(name => {
            const obj = scene.getObjectByName(name);
            if (obj) {
                obj.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
                scene.remove(obj);
            }
        });
    }

    function renderCurves(animate = false) {
        removeCurves();

        const compiled = compileFn(state.fnExpr);
        if (!compiled) {
            showError('Función no válida. Verifica la sintaxis.');
            return;
        }
        state.compiledFn = compiled;
        hideError();

        const { xMin, xMax, resolution } = state;
        const xValues = [];
        const step = (xMax - xMin) / resolution;
        for (let i = 0; i <= resolution; i++) {
            xValues.push(xMin + i * step);
        }

        // ─ Original f(x)
        if (state.showOriginal) {
            const pts = generateCurvePoints(x => evalFn(compiled, x), xMin, xMax, resolution);
            curveOriginal = createCurveFromPoints(pts, COLORS.original);
            curveOriginal.name = 'curveOriginal';
            scene.add(curveOriginal);
        }

        // ─ Derivative f'(x)
        if (state.showDerivative) {
            const pts = generateCurvePoints(x => numericalDerivative(compiled, x), xMin, xMax, resolution);
            curveDerivative = createCurveFromPoints(pts, COLORS.derivative);
            curveDerivative.name = 'curveDerivative';
            scene.add(curveDerivative);
        }

        // ─ Integral ∫f(x)dx
        if (state.showIntegral) {
            const intVals = numericalIntegral(compiled, xValues);
            const pts = [];
            for (let i = 0; i < xValues.length; i++) {
                const y = intVals[i];
                if (!isNaN(y) && isFinite(y)) {
                    pts.push(new THREE.Vector3(xValues[i], Math.max(-Y_CLAMP, Math.min(Y_CLAMP, y)), 0));
                } else {
                    pts.push(null);
                }
            }
            curveIntegral = createCurveFromPoints(pts, COLORS.integral);
            curveIntegral.name = 'curveIntegral';
            scene.add(curveIntegral);
        }

        // ─ Tangent line
        if (state.showTangent) {
            renderTangent();
        }

        // ─ Area
        if (state.showArea) {
            renderArea();
        }

        // Update formulas display
        updateFormulas();

        // Animate if requested
        if (animate) {
            animateDraw();
        }
    }

    function renderTangent() {
        // Remove existing tangent
        const existing = scene.getObjectByName('tangentGroup');
        if (existing) {
            existing.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            scene.remove(existing);
        }

        if (!state.compiledFn || !state.showTangent) return;

        const x0 = state.tangentX;
        const y0 = evalFn(state.compiledFn, x0);
        const slope = numericalDerivative(state.compiledFn, x0);

        if (isNaN(y0) || isNaN(slope)) return;

        const tangentGroup = new THREE.Group();
        tangentGroup.name = 'tangentGroup';

        // Tangent line
        const x1 = x0 - TANGENT_LENGTH;
        const x2 = x0 + TANGENT_LENGTH;
        const y1 = y0 + slope * (x1 - x0);
        const y2 = y0 + slope * (x2 - x0);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, y1, 0.05),
            new THREE.Vector3(x2, y2, 0.05),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
            color: COLORS.tangent,
            transparent: true,
            opacity: 0.85,
        });
        tangentGroup.add(new THREE.Line(lineGeo, lineMat));

        // Tangent glow
        const glowMat = new THREE.LineBasicMaterial({
            color: COLORS.tangent,
            transparent: true,
            opacity: 0.2,
        });
        tangentGroup.add(new THREE.Line(lineGeo.clone(), glowMat));

        // Point sphere
        const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: COLORS.tangent,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(x0, y0, 0.1);
        tangentGroup.add(sphere);

        // Sphere glow
        const glowSphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const glowSphereMat = new THREE.MeshBasicMaterial({
            color: COLORS.tangent,
            transparent: true,
            opacity: 0.15,
        });
        const glowSphere = new THREE.Mesh(glowSphereGeo, glowSphereMat);
        glowSphere.position.set(x0, y0, 0.1);
        tangentGroup.add(glowSphere);

        // Dashed line to axes
        const dashMat = new THREE.LineDashedMaterial({
            color: COLORS.tangent,
            transparent: true,
            opacity: 0.3,
            dashSize: 0.2,
            gapSize: 0.15,
        });

        const vLineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x0, 0, 0.02),
            new THREE.Vector3(x0, y0, 0.02),
        ]);
        const vLine = new THREE.Line(vLineGeo, dashMat);
        vLine.computeLineDistances();
        tangentGroup.add(vLine);

        const hLineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, y0, 0.02),
            new THREE.Vector3(x0, y0, 0.02),
        ]);
        const hLine = new THREE.Line(hLineGeo, dashMat.clone());
        hLine.computeLineDistances();
        tangentGroup.add(hLine);

        scene.add(tangentGroup);

        // Update info
        document.getElementById('tangent-fx').textContent = y0.toFixed(4);
        document.getElementById('tangent-fpx').textContent = slope.toFixed(4);
        document.getElementById('tangent-slope').textContent = `${slope.toFixed(4)}`;
    }

    function renderArea() {
        const existing = scene.getObjectByName('areaGroup');
        if (existing) {
            existing.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            scene.remove(existing);
        }

        if (!state.compiledFn || !state.showArea) return;

        const areaGroup = new THREE.Group();
        areaGroup.name = 'areaGroup';

        const a = Math.min(state.areaA, state.areaB);
        const b = Math.max(state.areaA, state.areaB);
        const steps = 200;
        const h = (b - a) / steps;

        // Create filled area using triangle strip
        const vertices = [];
        const indices = [];

        for (let i = 0; i <= steps; i++) {
            const x = a + i * h;
            let y = evalFn(state.compiledFn, x);
            if (isNaN(y)) y = 0;

            vertices.push(x, 0, -0.05);        // bottom vertex
            vertices.push(x, y, -0.05);         // top vertex

            if (i < steps) {
                const idx = i * 2;
                indices.push(idx, idx + 1, idx + 2);
                indices.push(idx + 1, idx + 3, idx + 2);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);

        const material = new THREE.MeshBasicMaterial({
            color: COLORS.areaFill,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
        });
        areaGroup.add(new THREE.Mesh(geometry, material));

        // Boundary lines
        const boundaryMat = new THREE.LineDashedMaterial({
            color: COLORS.areaFill,
            transparent: true,
            opacity: 0.5,
            dashSize: 0.2,
            gapSize: 0.1,
        });

        const yA = evalFn(state.compiledFn, a) || 0;
        const yB = evalFn(state.compiledFn, b) || 0;

        const lineAGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(a, 0, 0.01),
            new THREE.Vector3(a, yA, 0.01),
        ]);
        const lineA = new THREE.Line(lineAGeo, boundaryMat);
        lineA.computeLineDistances();
        areaGroup.add(lineA);

        const lineBGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(b, 0, 0.01),
            new THREE.Vector3(b, yB, 0.01),
        ]);
        const lineB = new THREE.Line(lineBGeo, boundaryMat.clone());
        lineB.computeLineDistances();
        areaGroup.add(lineB);

        scene.add(areaGroup);

        // Compute and display area value
        const areaVal = computeDefiniteIntegral(state.compiledFn, a, b);
        document.getElementById('area-value').textContent = isNaN(areaVal) ? 'N/D' : areaVal.toFixed(6);
    }

    // ─── Draw Animation ────────────────────────
    function animateDraw() {
        if (state.animating) return;
        state.animating = true;

        const curves = ['curveOriginal', 'curveDerivative', 'curveIntegral'].map(name =>
            scene.getObjectByName(name)
        ).filter(Boolean);

        if (curves.length === 0) {
            state.animating = false;
            return;
        }

        // Hide all curves initially
        curves.forEach(group => {
            group.traverse(child => {
                if (child.material) {
                    child.material._targetOpacity = child.material.opacity;
                    child.material.opacity = 0;
                }
            });
        });

        const duration = 1500; // ms
        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

            curves.forEach(group => {
                group.traverse(child => {
                    if (child.isLine && child.geometry) {
                        const geo = child.geometry;
                        const drawRange = Math.floor(eased * (geo.attributes.position.count));
                        geo.setDrawRange(0, drawRange);
                    }
                    if (child.material && child.material._targetOpacity !== undefined) {
                        child.material.opacity = child.material._targetOpacity * eased;
                    }
                });
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Reset draw ranges
                curves.forEach(group => {
                    group.traverse(child => {
                        if (child.isLine && child.geometry) {
                            child.geometry.setDrawRange(0, Infinity);
                        }
                    });
                });
                state.animating = false;
            }
        }

        requestAnimationFrame(animate);
    }

    // ─── Formula Display ───────────────────────
    function updateFormulas() {
        const fxEl = document.getElementById('formula-fx');
        const dfxEl = document.getElementById('formula-dfx');
        const ifxEl = document.getElementById('formula-ifx');

        fxEl.textContent = state.fnExpr;

        const derivStr = getSymbolicDerivative(state.fnExpr);
        state.derivativeExpr = derivStr;
        dfxEl.textContent = derivStr;
        ifxEl.textContent = `∫(${state.fnExpr})dx`;
    }

    // ─── Error Handling ────────────────────────
    function showError(msg) {
        const toast = document.getElementById('error-toast');
        document.getElementById('error-message').textContent = msg;
        toast.classList.remove('hidden');
        clearTimeout(toast._hideTimeout);
        toast._hideTimeout = setTimeout(() => toast.classList.add('hidden'), 4000);
    }

    function hideError() {
        document.getElementById('error-toast').classList.add('hidden');
    }

    // ─── Event Bindings ────────────────────────
    function bindEvents() {
        // Function input
        const fnInput = document.getElementById('function-input');
        let inputTimeout;
        fnInput.addEventListener('input', () => {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                state.fnExpr = fnInput.value.trim();
                renderCurves();
            }, 300);
        });

        fnInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(inputTimeout);
                state.fnExpr = fnInput.value.trim();
                renderCurves(true);
            }
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const fn = btn.dataset.fn;
                fnInput.value = fn;
                state.fnExpr = fn;
                renderCurves(true);
            });
        });

        // Range inputs
        document.getElementById('x-min').addEventListener('change', (e) => {
            state.xMin = parseFloat(e.target.value);
            renderCurves();
        });

        document.getElementById('x-max').addEventListener('change', (e) => {
            state.xMax = parseFloat(e.target.value);
            renderCurves();
        });

        const resSlider = document.getElementById('resolution');
        const resValue = document.getElementById('resolution-value');
        resSlider.addEventListener('input', (e) => {
            state.resolution = parseInt(e.target.value);
            resValue.textContent = state.resolution;
        });
        resSlider.addEventListener('change', () => renderCurves());

        // Toggle visibility
        document.getElementById('show-original').addEventListener('change', (e) => {
            state.showOriginal = e.target.checked;
            renderCurves();
        });

        document.getElementById('show-derivative').addEventListener('change', (e) => {
            state.showDerivative = e.target.checked;
            renderCurves();
        });

        document.getElementById('show-integral').addEventListener('change', (e) => {
            state.showIntegral = e.target.checked;
            renderCurves();
        });

        document.getElementById('show-tangent').addEventListener('change', (e) => {
            state.showTangent = e.target.checked;
            document.getElementById('tangent-section').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) {
                renderTangent();
            } else {
                const tg = scene.getObjectByName('tangentGroup');
                if (tg) scene.remove(tg);
            }
        });

        // Tangent position
        const tangentSlider = document.getElementById('tangent-x');
        const tangentVal = document.getElementById('tangent-x-value');
        tangentSlider.addEventListener('input', (e) => {
            state.tangentX = parseFloat(e.target.value);
            tangentVal.textContent = state.tangentX.toFixed(1);
            renderTangent();
        });

        // Area
        document.getElementById('show-area').addEventListener('change', (e) => {
            state.showArea = e.target.checked;
            document.getElementById('area-controls').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) {
                renderArea();
            } else {
                const ag = scene.getObjectByName('areaGroup');
                if (ag) scene.remove(ag);
            }
        });

        document.getElementById('area-a').addEventListener('change', (e) => {
            state.areaA = parseFloat(e.target.value);
            renderArea();
        });

        document.getElementById('area-b').addEventListener('change', (e) => {
            state.areaB = parseFloat(e.target.value);
            renderArea();
        });

        // Header buttons
        document.getElementById('btn-toggle-grid').addEventListener('click', () => {
            state.showGrid = !state.showGrid;
            gridGroup.visible = state.showGrid;
            document.getElementById('btn-toggle-grid').classList.toggle('active', state.showGrid);
        });

        document.getElementById('btn-toggle-axes').addEventListener('click', () => {
            state.showAxes = !state.showAxes;
            axesGroup.visible = state.showAxes;
            document.getElementById('btn-toggle-axes').classList.toggle('active', state.showAxes);
        });

        document.getElementById('btn-reset-camera').addEventListener('click', () => {
            gsapCameraReset();
        });

        // Animate button
        document.getElementById('btn-animate').addEventListener('click', () => {
            renderCurves(true);
        });
    }

    function gsapCameraReset() {
        const target = { x: 0, y: 0, z: 22 };
        const start = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
        };
        const duration = 800;
        const startTime = performance.now();

        function animate(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);

            camera.position.x = start.x + (target.x - start.x) * eased;
            camera.position.y = start.y + (target.y - start.y) * eased;
            camera.position.z = start.z + (target.z - start.z) * eased;

            controls.target.set(0, 0, 0);
            controls.update();

            if (t < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    // ─── Render Loop ───────────────────────────
    function renderLoop() {
        animationId = requestAnimationFrame(renderLoop);
        // En el inicio o en una lección el 3D está oculto: no se dibuja (ahorra batería y no traba
        // el celular, sobre todo dentro de una ventana de ZenBan)
        if (document.body.classList.contains('lesson-mode') || document.hidden) return;

        // Animate particles
        const particles = scene.getObjectByName('particles');
        if (particles) {
            particles.rotation.y += 0.0002;
            particles.rotation.x += 0.0001;
        }

        controls.update();
        renderer.render(scene, camera);
    }

    // ─── Mouse Tracking for Coordinates ────────
    function initMouseTracking() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const cursorInfo = document.getElementById('cursor-info');
        const cursorCoords = document.getElementById('cursor-coords');
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersection = new THREE.Vector3();

        renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            if (raycaster.ray.intersectPlane(plane, intersection)) {
                const x = intersection.x;
                const y = intersection.y;

                if (Math.abs(x) < 50 && Math.abs(y) < 50) {
                    cursorInfo.style.display = 'block';
                    cursorCoords.textContent = `x: ${x.toFixed(2)}  y: ${y.toFixed(2)}`;
                } else {
                    cursorInfo.style.display = 'none';
                }
            }
        });

        renderer.domElement.addEventListener('mouseleave', () => {
            cursorInfo.style.display = 'none';
        });
    }

    // ─── Init ──────────────────────────────────
    function init() {
        initThree();
        bindEvents();
        initMouseTracking();
        renderCurves(true);
        renderLoop();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 600);
        }, 800);
    }

    // Start when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
