(function () {
    'use strict';

    const svgGridSource = `
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" />
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="url(#smallGrid)" />
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#smallGrid)" />
</svg>
`;

    const svgGridImage = new Image();
    const svgGridBlob = new Blob([svgGridSource], {type: 'image/svg+xml;charset=utf-8'});
    const svgGridUrl = window.URL.createObjectURL(svgGridBlob);

    svgGridImage.onload = () => svgGrid.current = svgGridImage;
    svgGridImage.src = svgGridUrl;

    const svgGrid = {current: null};

    class Vector {
        /** @type {Number} **/
        x;

        /** @type {Number} **/
        y;

        /**
         *
         * @param {Number} x
         * @param {Number} y
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        /**
         *
         * @returns {Number[]}
         */
        coords(){
            return [this.x, this.y];
        }

        /**
         * @returns {Vector}
         */
        copy(){
            return new Vector(this.x, this.y);
        }

        /**
         *
         * @returns {Vector}
         */
        static zero(){
            return new Vector(0, 0);
        }

        /**
         *
         * @returns {Vector}
         */
        negate(){
            return new Vector(-this.x, -this.y);
        }

        /**
         *
         * @returns {Vector}
         */
        static random(lo_x, hi_x, lo_y, hi_y){
            return new Vector(Math.random() * (hi_x - lo_x) + lo_x, Math.random() * (hi_y - lo_y) + lo_y);
        }

        /**
         *
         * @param {Vector} v
         * @returns {Vector}
         */
        add(v) {
            return new Vector(this.x + v.x, this.y + v.y);
        }

        /**
         *
         * @param {Vector} v
         * @returns {Vector}
         */
        sub(v) {
            return new Vector(this.x - v.x, this.y - v.y);
        }

        /**
         *
         * @param {Vector} v
         * @returns {Number}
         */
        dot(v) {
            return v.x * this.x + v.y * this.y;
        }


        /**
         *
         * @param {Vector} v
         * @returns {Number}
         */
        distance(v) {
            return Math.sqrt(this.distanceSquared(v));
        }

        /**
         *
         * @param {Vector} v
         * @returns {Number}
         */
        distanceSquared(v) {
            return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
        }

        /**
         *
         * @returns {Number}
         */
        length() {
            return Math.sqrt(this.lengthSquared());
        }

        /**
         *
         * @returns {Number}
         */
        lengthSquared(){
            return this.x ** 2 + this.y ** 2;
        }

        /**
         *
         * @param {Number} s
         * @returns {Vector}
         */
        multiplyScalar(s){
            return new Vector(this.x * s, this.y * s);
        }

        /**
         *
         * @param {Number} s
         * @returns {Vector}
         */
        divideScalar(s){
            return new Vector(this.x / s, this.y / s);
        }

        /**
         *
         * @param {Vector} v
         * @returns {Vector}
         */
        multiplyVector(v){
            return new Vector(this.x * v.x, this.y * v.y);
        }

        /**
         *
         * @returns {Vector}
         */
        normalize(){
            return this.divideScalar(this.length());
        }

        /**
         * @param {Vector} v
         * @param {Number} delta
         * @returns {Boolean}
         */
        eq(v, delta = 0.00001){
            return Math.abs(v.x - this.x) <= 0.00001 && Math.abs(v.y - this.y) <= 0.00001;
        }
    }

    /**
     *
     * @param ctx
     * @param {Aircraft} aircraft
     * @param {String} color
     * @param texture
     */

    const renderAircraft = (ctx, aircraft, color = '#f0f0f0', texture) => {
        aircraft.trajectory.forEach((position, i, {length}) => {
            if(i % 2 === 0) return;
            ctx.fillStyle = color + Math.floor(0xff * i/length).toString(16).padStart(2, '0');
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(...position.coords(), 1, 0, 2 * Math.PI, false);
            ctx.fill();
        });

        ctx.save();
        ctx.translate(...aircraft.position.coords());
        ctx.rotate(aircraft.angle);
        if(texture.current)
            ctx.drawImage(texture.current, -20, -20, 40, 40);
        ctx.restore();
    };

    /**
     *
     * @param ctx
     * @param {AircraftGuided} aircraft
     * @param {String} color
     */
    const renderAircraftGuided = (ctx, aircraft, color = '#f0f0f0', texture) => {
        aircraft.sightLines.forEach(({line, from, to}, i, {length}) => {
            ctx.lineWidth = 1;
            ctx.strokeStyle= `rgba(168,215,102,${i/length})`;
            ctx.beginPath();
            ctx.moveTo(...from.coords());
            ctx.lineTo(...to.coords());
            ctx.stroke();
        });
        renderAircraft(ctx, aircraft, color, texture);
    };

    /**
     *
     * @param selector
     * @param color
     * @param min
     * @param max
     * @returns {function(...[*]=)}
     * @constructor
     */
    const ChartAngle = (selector, color="#4c0000") => {
        const canvas = document.querySelector(selector);

        const k = 12;

        let data;

        setInterval(() => {
            const ctx = canvas.getContext('2d');
            ctx.lineJoin = 'round';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(svgGrid.current)
                ctx.drawImage(svgGrid.current, 0, 0);
            ctx.beginPath();
            ctx.moveTo(0, -data[0]*k+canvas.height/2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            for(let i = 1; i < data.length; i++) {
                ctx.lineTo(i * canvas.width / 100 , -data[i]*k+canvas.height/2);
            }
            ctx.stroke();
        }, 1/20);

        return (_data) => {
            data = _data;
        };
    };

    const svgSourceAircraft = `
<svg xmlns="http://www.w3.org/2000/svg"
 width="1280.000000pt" height="1135.000000pt" viewBox="0 0 1280.000000 1135.000000"
 preserveAspectRatio="xMidYMid meet" style="fill: #ad0037">
<g transform="translate(0.000000,1135.000000) scale(0.100000,-0.100000)" >
<path d="M6335 11334 c-46 -24 -64 -43 -116 -122 -143 -217 -280 -772 -334
-1347 -25 -276 -35 -531 -42 -1130 l-7 -580 -146 -96 c-150 -100 -661 -451
-1045 -718 -121 -85 -225 -155 -232 -158 -8 -3 -12 119 -16 484 -3 406 -7 497
-20 542 -20 67 -39 88 -88 96 -46 8 -69 27 -69 59 0 61 -54 157 -79 142 -5 -4
-22 -45 -36 -91 -30 -100 -41 -109 -132 -103 -70 4 -82 14 -83 63 -1 36 -30
105 -54 124 -24 20 -35 6 -57 -75 -25 -89 -37 -106 -90 -118 -39 -10 -47 -17
-69 -61 -25 -50 -25 -51 -28 -380 -4 -333 9 -741 30 -1002 l11 -142 -44 -57
c-77 -100 -232 -216 -1024 -766 -762 -529 -1120 -782 -1131 -799 -16 -26 -24
0 -24 79 -1 191 -34 302 -96 322 -40 13 -49 28 -58 90 -8 58 -41 112 -64 108
-11 -2 -25 -28 -43 -80 -28 -85 -39 -102 -78 -121 -63 -30 -81 -130 -81 -463
l0 -241 -147 -98 c-415 -275 -674 -455 -725 -503 -103 -97 -124 -195 -115
-517 7 -216 13 -262 39 -279 20 -12 162 55 466 220 229 125 510 264 532 264
16 0 87 -110 131 -203 13 -26 26 -47 29 -47 3 0 35 59 70 132 122 247 208 361
321 424 253 141 1414 760 2024 1079 476 249 1318 674 1496 754 188 85 684 249
701 233 9 -10 26 -324 38 -707 14 -453 35 -837 80 -1435 48 -624 125 -1449
175 -1855 22 -174 20 -207 -11 -244 -14 -17 -94 -76 -177 -133 -84 -56 -343
-234 -577 -397 -234 -162 -503 -346 -597 -409 l-173 -114 0 -268 c0 -165 4
-271 10 -275 5 -3 319 93 697 214 823 262 850 271 868 271 15 0 20 -42 30
-230 6 -116 22 -192 53 -242 49 -79 66 -156 65 -291 0 -159 16 -166 36 -14 15
111 31 142 31 60 0 -53 14 -89 25 -63 3 8 9 35 13 59 8 51 32 69 32 24 0 -48
23 -193 30 -193 4 0 10 57 13 128 6 135 21 200 67 292 35 69 47 134 55 280 8
149 14 190 29 190 15 0 271 -80 1005 -315 443 -142 555 -175 562 -164 5 8 9
131 9 275 l0 261 -192 128 c-106 70 -366 248 -578 395 -212 146 -469 324 -572
394 -104 70 -192 136 -198 146 -14 26 -12 125 5 265 63 505 155 1531 204 2285
27 410 39 651 51 1055 10 309 27 625 34 633 4 4 203 -57 401 -122 213 -71 332
-125 910 -416 793 -400 2771 -1444 2958 -1562 71 -46 164 -177 258 -365 44
-90 82 -163 84 -163 2 0 21 30 41 68 71 130 106 182 119 182 20 0 218 -95 395
-189 619 -330 597 -321 624 -278 47 70 70 375 42 536 -9 52 -26 109 -37 127
-25 42 -124 134 -219 205 -76 56 -588 406 -691 471 l-57 36 -5 279 c-6 349
-21 419 -92 437 -26 7 -60 68 -70 128 -20 110 -82 75 -109 -62 -10 -50 -14
-56 -45 -66 -19 -6 -43 -23 -53 -37 -28 -39 -48 -149 -48 -269 0 -60 -2 -108
-5 -108 -3 0 -71 49 -152 108 -82 59 -566 398 -1077 752 -511 355 -945 660
-964 677 -35 33 -35 33 -29 100 43 476 63 1300 36 1449 -17 91 -51 134 -108
134 -29 0 -50 32 -70 105 -10 37 -25 74 -34 82 -22 23 -61 -31 -76 -106 -14
-71 -26 -81 -104 -81 -75 0 -93 17 -117 109 -20 78 -35 98 -59 78 -20 -17 -51
-87 -51 -118 0 -38 -24 -63 -72 -74 -96 -24 -105 -76 -116 -683 l-7 -443 -305
212 c-383 266 -1008 694 -1076 737 l-52 33 -5 652 c-6 720 -16 906 -73 1347
-68 532 -183 920 -324 1098 -68 87 -122 109 -185 76z"/>
</g>
</svg>
`;

    const svgSourceFighter = `
<svg xmlns="http://www.w3.org/2000/svg" transform="rotate(-90)" viewBox="0 -256 1950 1950" style="fill: #4a4dff">
  <g transform="matrix(1,0,0,-1,15.186441,1413.0508)" id="g3039">
    <path xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" d="m 1632,800 q 261,-58 287,-93 l 1,-3 q -1,-32 -288,-96 L 1280,576 1056,512 H 992 L 699,160 h 69 q 26,0 45,-4.5 19,-4.5 19,-11.5 0,-7 -19,-11.5 Q 794,128 768,128 H 672 512 448 v 32 h 64 V 576 H 352 L 160,352 H 64 l -32,32 v 192 h 32 v 32 h 128 v 8 L 0,640 v 128 l 192,24 v 8 H 64 v 32 H 32 v 192 l 32,32 h 96 L 352,832 h 160 v 416 h -64 v 32 h 64 160 96 q 26,0 45,-4.5 19,-4.5 19,-11.5 0,-7 -19,-11.5 -19,-4.5 -45,-4.5 H 699 L 992,896 h 64 l 224,-64 z" id="path3041" inkscape:connector-curvature="0"/>
  </g>
</svg>
`;

    const airplaneEnemyImage = new Image();
    const airplaneEnemyBlob = new Blob([svgSourceAircraft], {type: 'image/svg+xml;charset=utf-8'});
    const airplaneEnemyUrl = window.URL.createObjectURL(airplaneEnemyBlob);

    airplaneEnemyImage.onload = () => airplaneEnemy.current = airplaneEnemyImage;
    airplaneEnemyImage.src = airplaneEnemyUrl;

    const airplaneEnemy = {current: null};

    const airplaneFriendImage = new Image();
    const airplaneFriendBlob = new Blob([svgSourceFighter], {type: 'image/svg+xml;charset=utf-8'});
    const airplaneFriendUrl = window.URL.createObjectURL(airplaneFriendBlob);

    airplaneFriendImage.onload = () => airplaneFriend.current = airplaneFriendImage;
    airplaneFriendImage.src = airplaneFriendUrl;

    const airplaneFriend = {current: null};

    const svgSource = `
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://web.resource.org/cc/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" width="720" height="720" id="svg2">
  <defs id="defs4">
    <inkscape:path-effect effect="spiro" id="path-effect3201"/>
    <inkscape:path-effect effect="spiro" id="path-effect3197"/>
    <inkscape:path-effect effect="spiro" id="path-effect3193"/>
    <inkscape:path-effect effect="spiro" id="path-effect3189"/>
    <inkscape:path-effect effect="spiro" id="path-effect3185"/>
    <inkscape:path-effect effect="spiro" id="path-effect3181"/>
    <inkscape:path-effect effect="spiro" id="path-effect3177"/>
    <inkscape:path-effect effect="spiro" id="path-effect3173"/>
    <inkscape:path-effect effect="spiro" id="path-effect3169"/>
    <inkscape:path-effect effect="spiro" id="path-effect3165"/>
    <inkscape:path-effect effect="spiro" id="path-effect3161"/>
    <inkscape:path-effect effect="spiro" id="path-effect3157"/>
    <inkscape:path-effect effect="spiro" id="path-effect3153"/>
    <inkscape:path-effect effect="spiro" id="path-effect3149"/>
    <inkscape:path-effect effect="spiro" id="path-effect3149-6"/>
    <inkscape:path-effect effect="spiro" id="path-effect3153-1"/>
    <inkscape:path-effect effect="spiro" id="path-effect3157-8"/>
    <inkscape:path-effect effect="spiro" id="path-effect3161-4"/>
    <inkscape:path-effect effect="spiro" id="path-effect3165-8"/>
    <inkscape:path-effect effect="spiro" id="path-effect3169-4"/>
    <inkscape:path-effect effect="spiro" id="path-effect3173-0"/>
    <inkscape:path-effect effect="spiro" id="path-effect3177-7"/>
    <inkscape:path-effect effect="spiro" id="path-effect3181-6"/>
    <inkscape:path-effect effect="spiro" id="path-effect3185-8"/>
    <inkscape:path-effect effect="spiro" id="path-effect3189-9"/>
    <inkscape:path-effect effect="spiro" id="path-effect3193-7"/>
    <inkscape:path-effect effect="spiro" id="path-effect3197-3"/>
    <inkscape:path-effect effect="spiro" id="path-effect3201-3"/>
  </defs>
  <path d="m 329.6885371631169,144.9454094414912 c 0,0 -9.3691648630806,-18.5615530306314 -37.6534361478519,-6.3639610390736" id="path2983" style="fill:none;stroke:#ff0000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;display:none"/>
  <path d="m 326.8905349710195,144.9454094414912 c 0,0 -9.3691648630806,-18.5615530306314 -37.6534361478519,-6.3639610390736" id="path2983-8" style="fill:none;stroke:#ff0000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;display:none"/>
  <path d="M 94.6324614631855,36.00250586938022 300.1705854663462,193.5309023590188 342.0166705927379,44.6173400524073 401.0934966535268,195.9922835541695 564.785535530295,54.46286483300981 476.1702964391128,237.8357638717294 616.4777583334849,232.9130014814282 525.4009848231031,347.3672270559314 647.2469385734796,426.1314253007506 502.0164078407082,428.5928064959011 630.0161976390828,582.4291311928135 446.6318834087184,497.5114799601184 426.9396080551219,662.4240200352077 337.0936017543393,529.5094354970756 211.5553463751634,700.5754285600419 223.863018471161,486.4352645819405 52.7863763367938,520.8946013140482 159.8631235719732,380.5958731904649 72.47865169038992,237.8357638717299 194.3246054407665,261.2188852256607 94.6324614631855,36.00250586938069 z" id="path3508" style="fill:#ff0000;stroke:none"/>
  <path d="m 160.1985233083172,118.7982717399246 154.3242216264676,118.2770704473064 31.419302606586,-111.8087931572194 44.3566625034159,113.6568723829586 122.9049190198811,-106.2645554800019 -66.5349937551232,137.6819023175674 105.347073445612,-3.6961584514783 -68.3831880260988,85.9356839968712 91.4856164132948,59.1385352236531 -109.0434619875631,1.8480792257391 96.1061020907337,115.5049516086972 -137.6904731876862,-63.7587332880004 -14.7855541678056,123.8213081245232 -67.4590908906114,-99.7962781899145 -94.2579078197586,128.4415061888714 9.2409713548783,-160.7828926393062 -128.4495018328083,25.8731091603477 80.3964507874411,-105.3405158671315 -65.6108966196359,-107.1885950928715 91.4856164132951,17.5567526445221 -74.8518679745143,-169.0992491551333 z" id="path3512" style="fill:#ff8000;stroke:none"/>
  <path d="m 226.2365903979516,204.2096633100054 99.1022747159463,75.9539014973134 20.1765110200129,-71.8001725091792 28.4844861459008,72.9869522200746 78.9257636959331,-68.2398333764925 -42.7267292188508,88.4150884617163 67.6506545965139,-2.373559421791 -43.9135828082631,55.1852565566419 58.7492526759201,37.9769507486567 -70.0243617753388,1.1867797108955 61.7163866494512,74.17373193097 -88.4205924112332,-40.9439000258953 -9.4948287153004,79.5142406299997 -43.3201560135574,-64.0861043883581 -60.529533060039,82.4811899072385 5.9342679470626,-103.2498348479099 -82.4863244641708,16.614915952537 51.6281311394449,-67.6464435210443 -42.1333024241446,-68.8332232319403 58.7492526759201,11.2744072535075 -48.0675703712075,-108.5903435469403 z" id="path3514" style="fill:#ffff00;stroke:none"/>
  
  <metadata>
    <rdf:RDF>
      <cc:Work>
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
        <cc:license rdf:resource="http://creativecommons.org/licenses/publicdomain/"/>
        <dc:publisher>
          <cc:Agent rdf:about="http://openclipart.org/">
            <dc:title>Open Clip Art Library</dc:title>
          </cc:Agent>
        </dc:publisher>
        <dc:title>one eyed sun</dc:title>
        <dc:date>2011-07-10T22:19:30</dc:date>
        <dc:description>my mom came up with the name for this!</dc:description>
        <dc:source>http://openclipart.org/detail/148927/one-eyed-sun-by-10binary</dc:source>
        <dc:creator>
          <cc:Agent>
            <dc:title>10binary</dc:title>
          </cc:Agent>
        </dc:creator>
        <dc:subject>
          <rdf:Bag>
            <rdf:li>clip art</rdf:li>
            <rdf:li>clipart</rdf:li>
            <rdf:li>eyed</rdf:li>
            <rdf:li>one</rdf:li>
            <rdf:li>sun</rdf:li>
          </rdf:Bag>
        </dc:subject>
      </cc:Work>
      <cc:License rdf:about="http://creativecommons.org/licenses/publicdomain/">
        <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction"/>
        <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution"/>
        <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks"/>
      </cc:License>
    </rdf:RDF>
  </metadata>
</svg>
`;

    const explosionImage = new Image();
    const explosionBlob = new Blob([svgSource], {type: 'image/svg+xml;charset=utf-8'});
    const explosionUrl = window.URL.createObjectURL(explosionBlob);

    explosionImage.onload = () => explosion.current = explosionImage;
    explosionImage.src = explosionUrl;

    const explosion = {current: null};

    /**
     *
     * @param ctx
     * @param {Aircraft} aircraft
     */

    const renderExplosion = (ctx, aircraft) => {
        ctx.save();
        ctx.translate(...aircraft.position.coords());
        ctx.rotate(aircraft.angle);
        if(explosion.current)
            ctx.drawImage(explosion.current, -20, -20, 40, 40);
        ctx.restore();
    };

    /**
     *
     * @param selector
     * @param color
     * @returns {function(...[*]=)}
     * @constructor
     */
    const Chart = (selector, color = "#013d3d") => {
        const canvas = document.querySelector(selector);

        let data_y = [];

        setInterval(() => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(svgGrid)
                ctx.drawImage(svgGrid.current, 0, 0);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.moveTo(...coordsToCanvas(canvas)([0, data_y.length], data_y, 0, data_y[0]));
            for(let i = 1; i < data_y.length; i++){
                ctx.lineTo(...coordsToCanvas(canvas)([0, data_y.length], data_y, i, data_y[i]));
            }
            ctx.stroke();

        }, 1/20);

        return (_data_y) => {
            data_y = _data_y;
        };
    };

    const coordsToCanvas = (canvas) => (data_x, data_y, x, y) => [
        convertRange(x, bounds(data_x), [0, canvas.width]),
        canvas.height - convertRange(y, bounds(data_y), [0, canvas.height]),
    ];

    const bounds = data => [Math.min(...data), Math.max(...data)];

    function convertRange(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    const width = 500;
    const height = 500;

    const renderGuidanceValues = (selector, world) => {
        const chartData = {
            chart_alpha: ChartAngle(selector + ' table canvas.chart-value-alpha'),
            chart_omega: ChartAngle(selector + ' table canvas.chart-value-omega'),
            chart_d: Chart(selector + ' table canvas.chart-value-d'),
            chart_v: Chart(selector + ' table canvas.chart-value-v'),
            omega_history: [],
            d_history: [],
            v_history: []
        };
        renderGuidanceValuesHelper(selector, world, chartData);
    };

    const renderGuidanceValuesHelper = (selector, world, chartData) => {
        const table = document.querySelector(selector + '>table');
        if(world.uav){
            table.querySelector('.guidance-value-v-integer')
                .innerHTML = '+' + world.uav.params.v.toFixed(5).split('.')[0];
            table.querySelector('.guidance-value-v-floating')
                .innerHTML = world.uav.params.v.toFixed(5).split('.')[1];
            table.querySelector('.guidance-value-d-integer')
                .innerHTML = '+' + world.uav.params.d.toFixed(5).split('.')[0];
            table.querySelector('.guidance-value-d-floating')
                .innerHTML = world.uav.params.d.toFixed(5).split('.')[1];
            table.querySelector('.guidance-value-omega-integer')
                .innerHTML = world.uav.params.omega.toFixed(5).split('.')[0].padStart(2, '+');
            table.querySelector('.guidance-value-omega-floating')
                .innerHTML = world.uav.params.omega.toFixed(5).split('.')[1];
            table.querySelector('.guidance-value-alpha-integer')
                .innerHTML = world.uav.params.alpha.toFixed(5).split('.')[0].padStart(2, '+');
            table.querySelector('.guidance-value-alpha-floating')
                .innerHTML = world.uav.params.alpha.toFixed(5).split('.')[1];

            chartData.chart_alpha(world.uav.angle_speed_history);

            chartData.omega_history = [...chartData.omega_history.slice(-100), world.uav.params.omega];
            chartData.chart_omega(chartData.omega_history);

            chartData.d_history = [...chartData.d_history.slice(-100), world.uav.params.d];
            chartData.chart_d(chartData.d_history);

            chartData.v_history = [...chartData.v_history.slice(-100), world.uav.params.v];
            chartData.chart_v(chartData.v_history);
        }

        setTimeout(() => renderGuidanceValuesHelper(selector, world, chartData), 1000/60);
    };

    const renderGuidanceView = (selector, world) => {
        const canvas = document.querySelector(selector + '>canvas.world-view');
        canvas.width = width;
        canvas.height = height;

        renderGuidanceViewHelper(canvas, world);
    };

    const renderGuidanceViewHelper = (canvas, world) => {
        const {uav, enemy} = world;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(svgGrid.current)
            ctx.drawImage(svgGrid.current, 0, 0);

        renderAircraftGuided(ctx, uav, "#2d2dfc", airplaneFriend);

        renderAircraft(ctx, enemy, "#b80c48", airplaneEnemy);

        if(world.simulation.endedAt)
            renderExplosion(ctx, enemy);

        requestAnimationFrame(() => renderGuidanceViewHelper(canvas, world));
    };

    class World {
        simulation = {
            startedAt: null,
            endedAt: null,
        };

        /** @type {null|AircraftGuided|AircraftFuzzyGuided} **/
        uav = null;

        /** @type {null|Aircraft} **/
        enemy = null;

        resetSimulation(){
            this.simulation.startedAt = Date.now();
            this.simulation.endedAt = null;
        }

        update(delta = 1){
            const {uav, enemy} = this;

            uav.update(delta);
            enemy.update(delta);

            if(uav.position.distance(enemy.position) < 20) {
                this.simulation.endedAt = Date.now();
            }
        }
    }

    class Aircraft {
        /** @type {Vector} **/
        position;

        /** @type {Vector[]} **/
        trajectory = [];

        /** @type{Number} **/
        trajectory_limit = 500;

        /** @type {Number} **/
        speed;

        /** @type {Number} **/
        angle;

        /** @type {Number} **/
        angleSpeed = 0;

        /**
         *
         * @param {Vector} position
         * @param {Number} speed
         * @param {Number} angle
         */
        constructor(position = Vector.zero(), speed = 0, angle = 0, angleSpeed = 0) {
            this.position = position;
            this.speed = speed;
            this.angle = angle;
            this.angleSpeed = angleSpeed;
        }

        /**
         *
         * @returns {Vector}
         */
        getVelocity() {
            return new Vector(
                this.speed * Math.sin(this.angle),
                -1 * this.speed * Math.cos(this.angle)
            );
        }

        /**
         *
         * @param {Number} delta
         */
        update(delta = 1) {
            this.trajectory.push(this.position);
            this.trajectory = [...this.trajectory.slice(-this.trajectory_limit), this.position];

            this.angle += this.angleSpeed * delta;
            const velocity = this.getVelocity();
            this.position = this.position.add(velocity.multiplyScalar(delta));
        }
    }

    /**
     *
     * @param {Number} min
     * @param {Number} max
     * @param {Number} value
     * @returns {number}
     */
    const clamp = (min, max, value) => Math.min(max, Math.max(min, value));

    class SightLine {
        /** @type {Vector} **/
        line;
        /** @type {Vector} **/
        from;

        /**
         *
         * @param {Vector} from
         * @param {Vector} to
         */
        constructor(from, to) {
            this.line = to.sub(from);
            this.from = from;
            this.to = to;
        }

        /**
         *
         * @returns {Number}
         */
        distance(){
            return this.line.length();
        }

        angle(){
            return Math.atan2(this.line.y, this.line.x);
        }
    }

    class AircraftGuided extends Aircraft {
        params = {
            d: 0,
            v: 0,
            omega: 0,
            alpha: 0,
        }

        /** @type {Aircraft} **/
        target;

        /** @type {SightLine[]} **/
        sightLines = [];

        /** @type {Number[]} **/
        angle_speed_history = [];

        /** @type {Number} **/
        angle_speed_limit = 100;

        /**
         *
         * @param {Vector} position
         * @param {Number} speed
         * @param {Aircraft} target
         */
        constructor(position = Vector.zero(), speed = 0, target) {
            super(position, speed, 0);
            this.target = target;
            this.updateSightLines();
            this.updateSightLines();
        }

        updateSightLines(){
            const sightLine = new SightLine(this.position, this.target.position);
            this.sightLines = [...this.sightLines.slice(-50), sightLine];
        }

        getGuidanceVars(delta){
            const {sightLines} = this;
            const sightLine = sightLines[sightLines.length - 1];
            const d = sightLine.distance();

            const sightLinePrev = sightLines[sightLines.length - 2];
            const v = Math.abs(sightLinePrev.distance() - d) / delta;

            const omega = (sightLine.angle() - sightLinePrev.angle()) / delta;

            return {d, v, omega};
        }

        updateGuidance(delta) {
            this.updateSightLines();
            const {d, v, omega} = this.getGuidanceVars(delta);
            const alpha = clamp(-Math.PI * 2, Math.PI * 2, (omega * d) / v);
            this.angleSpeed = isNaN(alpha) ? 0 : alpha;
            this.params = {d, v, omega, alpha};

            this.angle_speed_history = [...this.angle_speed_history.slice(-this.angle_speed_limit), alpha];
        }
    }

    class FuzzySet {
        /** @type {Number} **/
        fuzzyValue = 0;

        /**
         *
         * @returns {number}
         */
        getFuzzyArea() {
            return 0;
        }

        /**
         *
         * @returns {number}
         */
        getCenter() {
            return 0;
        }

        /**
         *
         * @param {Number} x
         * @returns {Number}
         */
        calculateFuzzyValue(x) {
            return 0;
        }
    }

    /**
     * @inheritDoc
     * @augments FuzzySet
     */
    class FuzzySetTRIMF extends FuzzySet {
        /** @type {Number} **/
        p1;

        /** @type {Number} **/
        p2;

        /** @type {Number} **/
        p3;

        /**
         *
         * @param {Number} p1
         * @param {Number} p2
         * @param {Number} p3
         */
        constructor(p1, p2, p3) {
            super();
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
        }

        getArea() {
            const {p1, p2, p3} = this;

            if(!(p3 > p2 && p2 > p1)) return 0;

            if(p1 < 0){
                const p1_ = 0;
                const p3_ = p3 + (-p1);
                return (p3_ - p1_) / 2;
            }
            else {
                return (p3 - p1) / 2;
            }
        }

        getFuzzyArea() {
            return (1 - (1 - this.fuzzyValue) ** 2) * this.getArea();
        }

        getCenter() {
            return this.p2;
        }

        calculateFuzzyValue(x) {
            this.fuzzyValue = 0;

            const {p1, p2, p3} = this;

            if(p3 > p2 && p2 > p1){
                if(x > p1 && x <= p2){
                    this.fuzzyValue = (x - p1) / (p2 - p1);
                }
                else if(x > p2 && x < p3){
                    this.fuzzyValue = 1.0 - ((x - p2) / (p3 - p2));
                }
            }

            return this.fuzzyValue;
        }
    }

    class FuzzyVariable {
        /** @type {Object.<*>} **/
        set = {};

        /** @type {Object.<*>} **/
        rule = {};

        /**
         *
         * @param {Number} v
         */
        fuzzyfy(v) {
            Object.values(this.set).forEach(set => set.calculateFuzzyValue(v));
        }

        /**
         *
         * @returns {Number}
         */
        defuzzify() {
            Object.entries(this.set)
                .forEach(([name, set]) => {
                    if(this.rule[name])
                        set.fuzzyValue = this.rule[name].fire();
                });

            let sumOfWeights = 0;
            let weighedSum = 0;

            Object.values(this.set)
                .forEach(set => {
                    sumOfWeights += set.getFuzzyArea() * set.getCenter();
                    weighedSum += set.getFuzzyArea();
                });

            return sumOfWeights === 0 ? 0 : weighedSum / sumOfWeights;
        }
    }

    class FuzzyRule {
        /** @type {Array[]} **/
        expressions = [];

        /**
         *
         * @param {FuzzySet[]} expr
         */
        add(...expr) {
            this.expressions.push(expr);
        }

        fire() {
            return Math.max(...this.expressions.map(expr => Math.min(...expr.map(set => set.fuzzyValue))));
        }
    }

    class AircraftFuzzyGuided extends AircraftGuided {
        fuzzy = {
            d: null,
            alpha: null,
            omega: null
        };

        /**
         *
         * @param {Vector} position
         * @param {Number} speed
         * @param {Aircraft} target
         */
        constructor(position = Vector.zero(), speed = 0, target) {
            super(position, speed, target);

            const approachVelocity = new FuzzyVariable();
            const distance = new FuzzyVariable();
            const sightlineAngleVelocity = new FuzzyVariable();
            const desiredAngleVelocity = new FuzzyVariable();

            const v = approachVelocity;
            v.set.Z = new FuzzySetTRIMF(0, 10, 15);
            v.set.S = new FuzzySetTRIMF(10, 15, 20);
            v.set.L = new FuzzySetTRIMF(20, 30, 1000);

            const d = distance;
            d.set.Z = new FuzzySetTRIMF(0, 25, 50);
            d.set.S = new FuzzySetTRIMF(25, 250, 1000);
            d.set.L = new FuzzySetTRIMF(950, 5000, 10000);

            const omega = sightlineAngleVelocity;
            omega.set.LN = new FuzzySetTRIMF(-Math.PI*2, -1.75*Math.PI, -0.1 * Math.PI);
            omega.set.N = new FuzzySetTRIMF(-1.75*Math.PI, -0.5 * Math.PI, 0);
            omega.set.Z = new FuzzySetTRIMF(-0.5*Math.PI, 0, 0.5*Math.PI);
            omega.set.P = new FuzzySetTRIMF(0, 0.5 * Math.PI, 1.75*Math.PI);
            omega.set.LP = new FuzzySetTRIMF(0.1 * Math.PI, -1.75*Math.PI, Math.PI*2);

            const alpha = desiredAngleVelocity;
            alpha.set.LN = new FuzzySetTRIMF(-Math.PI*2, -Math.PI, -0.9*Math.PI);
            alpha.set.N = new FuzzySetTRIMF(-Math.PI, -0.9*Math.PI, 0);
            alpha.set.Z = new FuzzySetTRIMF(-0.9*Math.PI, 0, 0.9*Math.PI);
            alpha.set.P = new FuzzySetTRIMF(0, 0.9*Math.PI, Math.PI);
            alpha.set.LP = new FuzzySetTRIMF(0.9*Math.PI, Math.PI, Math.PI*2);

            alpha.rule.LN = new FuzzyRule;
            alpha.rule.LN.add(d.set.S, omega.set.N);
            alpha.rule.LN.add(d.set.S, omega.set.LN);
            alpha.rule.LN.add(d.set.L, omega.set.LN);
            alpha.rule.LN.add(omega.set.LP, v.set.L);
            alpha.rule.LN.add(omega.set.LP, v.set.S);

            alpha.rule.N = new FuzzyRule;
            alpha.rule.N.add(d.set.L, omega.set.N);
            alpha.rule.N.add(omega.set.N, v.set.S);

            alpha.rule.Z = new FuzzyRule;
            alpha.rule.Z.add(d.set.Z, omega.set.LN);
            alpha.rule.Z.add(d.set.Z, omega.set.N);
            alpha.rule.Z.add(d.set.Z, omega.set.Z);
            alpha.rule.Z.add(d.set.Z, omega.set.P);
            alpha.rule.Z.add(d.set.Z, omega.set.LP);
            alpha.rule.Z.add(d.set.Z, omega.set.Z);
            alpha.rule.Z.add(d.set.S, omega.set.Z);
            alpha.rule.Z.add(d.set.L, omega.set.Z);

            alpha.rule.P = new FuzzyRule;
            alpha.rule.P.add(d.set.L, omega.set.P);
            alpha.rule.P.add(omega.set.P, v.set.S);

            alpha.rule.LP = new FuzzyRule;
            alpha.rule.LP.add(d.set.S, omega.set.P);
            alpha.rule.LP.add(d.set.S, omega.set.LP);
            alpha.rule.LP.add(d.set.L, omega.set.LP);
            alpha.rule.LP.add(omega.set.LP, v.set.L);
            alpha.rule.LP.add(omega.set.LP, v.set.S);

            this.fuzzy.alpha = alpha;
            this.fuzzy.omega = omega;
            this.fuzzy.d = d;
            this.fuzzy.v = v;
        }

        updateGuidance(delta) {
            this.updateSightLines();
            const {d, v, omega} = this.getGuidanceVars(delta);
            this.fuzzy.v.fuzzyfy(v);
            this.fuzzy.d.fuzzyfy(d);
            this.fuzzy.omega.fuzzyfy(omega);
            const alpha = clamp(-Math.PI * 2, Math.PI * 2, this.fuzzy.alpha.defuzzify());
            this.angleSpeed = alpha;
            this.params = {d, v, omega, alpha};

            this.angle_speed_history = [...this.angle_speed_history.slice(-this.angle_speed_limit), alpha];
        }
    }

    class Universe {
        /** @type {*} **/
        worlds = {
            fuzzy: new World,
            crisp: new World
        };

        reset = false;

        generate() {
            const {crisp, fuzzy} = this.worlds;

            const enemy_pos = Vector.random(200, 300, 200, 300);
            const enemy_speed = Math.random() * 20 + 10;
            const enemy_angle = Math.random() * 200 - 100;
            const enemy_angleSpeed = 0;

            const uav_pos = enemy_pos.add(Vector.random(-200, 200, 200, 200));
            const uav_speed = Math.random() * 20 + 30;

            crisp.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);
            fuzzy.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);

            crisp.uav = new AircraftGuided(uav_pos, uav_speed, crisp.enemy);
            fuzzy.uav = new AircraftFuzzyGuided(uav_pos, uav_speed, fuzzy.enemy);
        }

        updateSimulation(delta = 1) {
            const {crisp, fuzzy} = this.worlds;

            if(!crisp.simulation.endedAt)
                crisp.update(delta);

            if(!fuzzy.simulation.endedAt)
                fuzzy.update(delta);

            if(fuzzy.simulation.endedAt && crisp.simulation.endedAt && !this.reset){
                this.reset = true;
                setTimeout(() => {
                    this.reset = false;
                    this.generate();
                    fuzzy.resetSimulation();
                    crisp.resetSimulation();
                }, 1000);
            }

            setTimeout(() => this.updateSimulation(delta), delta * 1000);
        }

        updateGuidance(delta) {
            const {crisp, fuzzy} = this.worlds;

            if(!crisp.simulation.endedAt)
                this.worlds.crisp.uav.updateGuidance(delta);
            if(!fuzzy.simulation.endedAt)
                this.worlds.fuzzy.uav.updateGuidance(delta);

            setTimeout(() => this.updateGuidance(delta), delta * 1000);
        }
    }

    const universe = new Universe();

    universe.generate();
    universe.updateSimulation(1/60);
    universe.updateGuidance(1/60);

    renderGuidanceView('.crisp-guidance-view', universe.worlds.crisp);
    renderGuidanceView('.fuzzy-guidance-view', universe.worlds.fuzzy);

    renderGuidanceValues('.crisp-guidance-view', universe.worlds.crisp);
    renderGuidanceValues('.fuzzy-guidance-view', universe.worlds.fuzzy);

}());
//# sourceMappingURL=bundle.js.map
