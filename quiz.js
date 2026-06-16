/* ═══════════════════════════════════════════════════════
   quiz.js — Motor de quizzes interactivos para Masterclass ML
   Sergio Dussán
   ═══════════════════════════════════════════════════════ */

const QUIZZES = {

  regresion: [
    {
      q: "¿Qué penalización usa Ridge Regression?",
      opts: ["L1 — valor absoluto de los coeficientes","L2 — cuadrado de los coeficientes","Ninguna penalización","Penalización por el número de features"],
      ans: 1,
      exp: "Ridge usa penalización L2: suma de los cuadrados de los coeficientes (α·Σβⱼ²). Esto encoge los coeficientes pero ninguno llega exactamente a cero."
    },
    {
      q: "¿Cuál modelo hace selección automática de features al llevar coeficientes a exactamente 0?",
      opts: ["Ridge","ElasticNet","Lasso","Regresión Lineal (OLS)"],
      ans: 2,
      exp: "Lasso (L1) fuerza coeficientes a exactamente cero gracias a su penalización por valor absoluto. Esto es equivalente a selección automática de features."
    },
    {
      q: "¿Por qué es obligatorio escalar antes de entrenar Ridge o Lasso?",
      opts: ["Para que el modelo sea más rápido","Porque la penalización trata todos los coeficientes por igual sin importar la escala original","Para reducir el número de features","Para evitar overfitting"],
      ans: 1,
      exp: "La regularización penaliza los coeficientes por igual. Si las features tienen escalas muy diferentes, la penalización será injusta — features grandes serán penalizadas más aunque no sean menos importantes."
    },
    {
      q: "¿Qué métrica mide la proporción de varianza del target explicada por el modelo?",
      opts: ["MAE","RMSE","R² (coeficiente de determinación)","MAPE"],
      ans: 2,
      exp: "R² = 1 − SSres/SStot. Un R²=1 significa predicción perfecta; R²=0 significa que el modelo no explica nada de la varianza; puede ser negativo si el modelo es peor que predecir la media."
    },
    {
      q: "En validación cruzada K-Fold, ¿qué es el score final reportado?",
      opts: ["El mejor score de todos los folds","El score del último fold","El promedio de los K scores de validación","El score en el conjunto de test"],
      ans: 2,
      exp: "El score final es el promedio (y desviación estándar) de los K scores de validación. Esto reduce la varianza de la estimación y da una medida más confiable de la capacidad de generalización."
    },
    {
      q: "¿Cuándo es mejor usar ElasticNet en lugar de Lasso?",
      opts: ["Cuando hay pocos features","Cuando hay grupos de features correladas entre sí","Cuando el dataset es muy pequeño","Cuando no hay outliers"],
      ans: 1,
      exp: "Lasso tiende a seleccionar arbitrariamente uno de los features de un grupo correlado. ElasticNet (L1+L2) maneja grupos correlados mejor gracias al componente Ridge, distribuyendo los coeficientes entre todos los features del grupo."
    }
  ],

  clasificacion: [
    {
      q: "¿Por qué el accuracy es una métrica engañosa con clases desbalanceadas?",
      opts: ["Porque es difícil de calcular","Porque un modelo que predice siempre la clase mayoritaria tiene accuracy alto pero es inútil","Porque solo funciona con dos clases","Porque no considera los verdaderos positivos"],
      ans: 1,
      exp: "Con 95% clase 0 y 5% clase 1, un modelo que predice siempre 0 tiene 95% accuracy pero recall=0 en la clase minoritaria. Usa F1-Score o ROC-AUC en estos casos."
    },
    {
      q: "¿Qué mide el Recall (Sensibilidad)?",
      opts: ["De lo predicho positivo, ¿cuánto era real?","De todos los positivos reales, ¿cuántos encontró el modelo?","La proporción de verdaderos negativos","El área bajo la curva ROC"],
      ans: 1,
      exp: "Recall = TP/(TP+FN). Mide la capacidad del modelo para encontrar todos los positivos reales. Es crítico cuando el coste de los falsos negativos es alto, como en diagnóstico médico."
    },
    {
      q: "¿Qué técnica genera ejemplos sintéticos de la clase minoritaria interpolando entre vecinos?",
      opts: ["Undersampling aleatorio","Tomek Links","SMOTE","class_weight='balanced'"],
      ans: 2,
      exp: "SMOTE (Synthetic Minority Oversampling TEchnique): x_new = xᵢ + λ·(xₙ − xᵢ) donde λ ~ U(0,1). No repite ejemplos idénticos, sino que crea puntos sintéticos entre vecinos reales de la clase minoritaria."
    },
    {
      q: "¿Por qué StratifiedKFold es preferible a KFold estándar en clasificación?",
      opts: ["Porque es más rápido","Porque preserva la proporción de clases en cada fold","Porque genera más folds","Porque no requiere escalado previo"],
      ans: 1,
      exp: "StratifiedKFold garantiza que cada fold tenga la misma proporción de clases que el dataset completo. Con clases desbalanceadas, un fold podría no tener ningún ejemplo de la clase minoritaria con KFold estándar."
    },
    {
      q: "¿Qué representa el área bajo la curva ROC (ROC-AUC)?",
      opts: ["La probabilidad de que el modelo clasifique correctamente todas las muestras","La probabilidad de que el modelo asigne mayor score a un positivo aleatorio que a un negativo aleatorio","El F1-Score promedio","La precisión máxima alcanzable"],
      ans: 1,
      exp: "ROC-AUC = P(score(positivo) > score(negativo)). Un AUC de 0.5 equivale a predicción aleatoria; AUC=1 es perfecto. Es insensible al umbral de clasificación, lo que lo hace ideal para comparar modelos."
    },
    {
      q: "¿Cuándo es más informativa PR-AUC que ROC-AUC?",
      opts: ["Cuando las clases están balanceadas","Cuando el dataset es muy grande","Cuando la clase positiva es muy rara (alta tasa de negativos)","Cuando se usa SVM"],
      ans: 2,
      exp: "Con clases muy desbalanceadas (ej. fraude: 0.1% positivos), ROC-AUC puede ser optimistamente alto porque hay muchos verdaderos negativos. PR-AUC es más discriminativa porque se enfoca en la clase positiva."
    }
  ],

  nosupervisado: [
    {
      q: "¿Por qué es crítico escalar antes de aplicar K-Means o PCA?",
      opts: ["Para acelerar el algoritmo","Porque las distancias euclídeas son sensibles a la escala — un feature en miles domina sobre uno en decimales","Para reducir el número de clusters","Para mejorar la visualización"],
      ans: 1,
      exp: "K-Means y PCA usan distancias euclídeas o varianzas. Sin escalado, un feature como 'salario' (miles) dominaría completamente sobre 'edad' (decenas), haciendo que los clusters dependan casi solo de esa variable."
    },
    {
      q: "¿Qué ventaja principal tiene DBSCAN sobre K-Means?",
      opts: ["Es más rápido con datasets grandes","No requiere especificar K y puede detectar clusters de forma arbitraria y puntos de ruido","Genera mejores clusters en datos esféricos","No necesita escalar los datos"],
      ans: 1,
      exp: "DBSCAN descubre el número de clusters automáticamente y puede encontrar clusters de cualquier forma (no solo esféricos). Además, clasifica como ruido (etiqueta -1) los puntos en regiones de baja densidad."
    },
    {
      q: "¿Qué rango de valores tiene el Silhouette Score y qué significa el valor 1?",
      opts: ["[0, 1] — el modelo no tiene errores","[−1, 1] — clusters perfectamente separados y cohesivos","[0, ∞) — menor es mejor","[0, 100] — porcentaje de muestras bien asignadas"],
      ans: 1,
      exp: "Silhouette ∈ [−1, 1]. Valor 1: punto muy dentro de su cluster y lejos de otros. Valor 0: punto en el borde entre clusters. Valor negativo: punto probablemente asignado al cluster incorrecto."
    },
    {
      q: "¿Para qué sirve principalmente t-SNE?",
      opts: ["Preprocesamiento antes de modelos de clasificación","Visualización en 2D o 3D — NO para preprocessing de modelos downstream","Reducir el número de clusters necesarios","Acelerar el entrenamiento de K-Means"],
      ans: 1,
      exp: "t-SNE no es proyectable a nuevos datos y sus distancias absolutas no son interpretables. Solo es válido para visualización exploratoria. Para preprocessing usa PCA o UMAP."
    },
    {
      q: "En el Elbow Method, ¿qué se grafica y qué se busca?",
      opts: ["Silhouette Score vs. número de iteraciones — buscar el máximo","Inercia (WCSS) vs. K — buscar el punto donde la disminución se estabiliza (codo)","Error de reconstrucción vs. K — buscar el mínimo","ARI vs. K — buscar el máximo"],
      ans: 1,
      exp: "Se grafica la inercia (WCSS = suma de distancias cuadráticas de cada punto a su centroide) vs. el número de clusters K. El 'codo' es el punto donde añadir más clusters no reduce significativamente la inercia."
    },
    {
      q: "¿Qué mide el Adjusted Rand Index (ARI) y qué rango tiene?",
      opts: ["La inercia normalizada — [0, ∞)","La similitud entre el clustering y las etiquetas reales, corregida por azar — [−1, 1]","El número óptimo de clusters — [2, 20]","La varianza explicada por los clusters — [0, 100%]"],
      ans: 1,
      exp: "ARI ∈ [−1, 1]. Valor 1: clustering idéntico a las etiquetas reales. Valor 0: clustering aleatorio. La corrección por azar es importante: un clustering aleatorio con muchos clusters puede tener RI alto sin ser informativo."
    }
  ],

  redesNeuronales: [
    {
      q: "¿Por qué no se inicializan todos los pesos a cero en una red neuronal?",
      opts: ["Porque cero no es un número válido en TensorFlow","Porque todas las neuronas calcularían los mismos gradientes y aprenderían lo mismo — problema de simetría","Porque la red no podría converger con el optimizador","Porque el forward pass daría error"],
      ans: 1,
      exp: "Con pesos iguales, todas las neuronas de una misma capa calculan exactamente la misma función, reciben los mismos gradientes y se actualizan de la misma forma. Nunca se diferenciarían. Se necesita aleatoriedad para romper la simetría."
    },
    {
      q: "¿Qué problema soluciona principalmente ReLU frente a Sigmoid en capas ocultas profundas?",
      opts: ["Reduce el tiempo de entrenamiento a la mitad","Evita el problema del gradiente que desaparece (vanishing gradient)","Genera probabilidades en el rango [0,1]","Reduce el número de parámetros necesarios"],
      ans: 1,
      exp: "Sigmoid satura (derivada ≈ 0 en valores grandes) → los gradientes se multiplican por valores cercanos a 0 repetidamente → en capas profundas llegan a 0 (vanishing). ReLU tiene derivada constante (1 para x>0), lo que permite que los gradientes fluyan sin atenuarse."
    },
    {
      q: "¿Qué hace Dropout durante el entrenamiento?",
      opts: ["Elimina permanentemente las neuronas menos útiles","Desactiva aleatoriamente una fracción de neuronas en cada forward pass, forzando redundancia","Reduce la tasa de aprendizaje en épocas avanzadas","Normaliza las activaciones por mini-batch"],
      ans: 1,
      exp: "Dropout desactiva cada neurona con probabilidad p durante el entrenamiento. Esto fuerza a la red a aprender representaciones redundantes y reduce la co-adaptación entre neuronas, actuando como un ensemble de muchas redes distintas."
    },
    {
      q: "¿Qué tipo de arquitectura es más adecuada para clasificar imágenes?",
      opts: ["MLP (capas Dense) — captura relaciones espaciales más eficientemente","CNN — filtros compartidos que son invariantes a la traslación","RNN — porque procesa píxeles secuencialmente","Autoencoder — porque comprime la imagen"],
      ans: 1,
      exp: "Las CNN aprenden filtros espaciales compartidos que detectan patrones (bordes, texturas) en cualquier posición de la imagen. MLP trataría cada píxel como una feature independiente, sin aprovechar la estructura espacial."
    },
    {
      q: "¿Cuál es la diferencia principal entre LSTM y RNN simple?",
      opts: ["LSTM es más rápido de entrenar","LSTM tiene puertas de memoria (forget, input, output) que pueden retener información por muchos pasos temporales","LSTM no necesita backpropagation","LSTM solo funciona con secuencias de texto"],
      ans: 1,
      exp: "RNN simple sufre de vanishing gradient al propagar gradientes hacia atrás en secuencias largas. LSTM resuelve esto con una celda de estado Cₜ y tres puertas que controlan cuánta información recordar, olvidar o pasar a la salida."
    },
    {
      q: "¿Qué ocurre cuando el train loss es muy bajo pero el val loss es alto y sigue subiendo?",
      opts: ["El modelo está en underfitting — necesita más capacidad","El modelo está en overfitting — memoriza el training set sin generalizar","El learning rate es demasiado bajo","El batch size es incorrecto"],
      ans: 1,
      exp: "Esta brecha creciente entre train loss y val loss es la señal clásica de overfitting. El modelo memoriza los datos de entrenamiento en lugar de aprender patrones generalizables. Soluciones: Dropout, L2, EarlyStopping, más datos o Data Augmentation."
    }
  ],

  keras: [
    {
      q: "¿Cuándo deberías usar la Functional API de Keras en lugar de Sequential?",
      opts: ["Cuando el modelo tiene muchas capas","Cuando necesitas múltiples entradas/salidas, skip connections o ramas paralelas","Cuando el dataset es muy grande","Cuando usas GPU"],
      ans: 1,
      exp: "Sequential solo permite una pila lineal de capas. La Functional API permite DAGs (grafos acíclicos dirigidos): múltiples inputs, múltiples outputs, conexiones residuales tipo ResNet, ramas paralelas tipo Inception. Es la API estándar en producción."
    },
    {
      q: "¿Qué función de pérdida y activación de salida usar para clasificación multiclase con etiquetas enteras?",
      opts: ["categorical_crossentropy + softmax","sparse_categorical_crossentropy + softmax","binary_crossentropy + sigmoid","mean_squared_error + linear"],
      ans: 1,
      exp: "sparse_categorical_crossentropy acepta etiquetas como enteros directamente (0, 1, 2…). categorical_crossentropy requiere one-hot encoding. Ambas usan softmax en la capa de salida para producir probabilidades que sumen 1."
    },
    {
      q: "¿Qué hace EarlyStopping con restore_best_weights=True?",
      opts: ["Guarda el modelo cada época","Detiene el entrenamiento y restaura los pesos del mejor época según la métrica monitorizada","Reduce el learning rate cuando no mejora","Reinicia el entrenamiento desde cero"],
      ans: 1,
      exp: "Sin restore_best_weights, el modelo quedaría con los pesos de la última época (que puede ser peor que la mejor). Con esta opción, al detenerse restaura automáticamente los pesos de la época con mejor val_loss (o la métrica elegida)."
    },
    {
      q: "¿Cuál es la diferencia entre feature extraction y fine-tuning en transfer learning?",
      opts: ["No hay diferencia — son lo mismo","Feature extraction: base model congelado, solo entrena clasificador. Fine-tuning: descongelar capas superiores con LR muy bajo","Feature extraction es más preciso que fine-tuning","Fine-tuning solo funciona con modelos de lenguaje"],
      ans: 1,
      exp: "Feature extraction (base.trainable=False): el modelo preentrenado actúa como extractor de características fijo. Fine-tuning (descongelar últimas capas + LR 10-100× menor): adapta los pesos preentrenados al nuevo dominio. Fine-tuning suele ser más preciso pero requiere más cuidado para no sobreescribir el conocimiento previo."
    },
    {
      q: "¿Para qué sirve ReduceLROnPlateau?",
      opts: ["Para aumentar el learning rate cuando el modelo converge demasiado rápido","Para reducir el learning rate cuando la pérdida se estanca, permitiendo ajustes más finos","Para cambiar automáticamente el optimizador","Para añadir más capas al modelo si no converge"],
      ans: 1,
      exp: "ReduceLROnPlateau monitoriza una métrica y si no mejora en 'patience' épocas, multiplica el LR por 'factor' (típico: 0.5). Esto permite empezar con LR alto para convergencia rápida y refinarlo cuando el modelo se acerca al óptimo."
    },
    {
      q: "¿Qué formato de exportación es más adecuado para desplegar un modelo Keras en dispositivos móviles?",
      opts: [".keras — el formato nativo","SavedModel — para TF Serving","TFLite — optimizado para móvil y edge con cuantización","ONNX — para interoperabilidad con PyTorch"],
      ans: 2,
      exp: "TFLite convierte el modelo a un formato compacto y optimizado para dispositivos móviles y edge. Con cuantización INT8 el modelo puede ser 4× más pequeño y 2-4× más rápido, con pérdida mínima de precisión."
    }
  ]
};

/* ═══ RENDER QUIZ ═══ */
function renderQuiz(key, containerId) {
  const questions = QUIZZES[key];
  if (!questions) return;
  const container = document.getElementById(containerId);
  if (!container) return;

  let score = 0, answered = 0;
  const total = questions.length;

  container.innerHTML = `
    <div class="quiz-header">
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:.3rem">🧪 Quiz de autoevaluación</h3>
      <p style="font-size:13px;color:var(--muted)">
        ${total} preguntas · Responde para ver la explicación</p>
      <div class="quiz-score-bar" style="margin-top:.75rem">
        <div style="height:6px;background:#e5e7eb;border-radius:999px;overflow:hidden">
          <div id="quiz-progress-${key}" style="height:100%;width:0%;background:linear-gradient(90deg,#378ADD,#534AB7);transition:width .4s;border-radius:999px"></div>
        </div>
        <div id="quiz-score-${key}" style="font-size:12px;color:var(--muted);margin-top:4px">
          0 / ${total} respondidas</div>
      </div>
    </div>
    <div class="quiz-questions" style="margin-top:1.25rem">
      ${questions.map((q,i) => `
        <div class="quiz-q" id="qq-${key}-${i}" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:1.25rem;margin-bottom:1rem">
          <div style="font-size:14px;font-weight:600;margin-bottom:.9rem;color:#111827">
            <span style="color:var(--accent);font-size:13px">Pregunta ${i+1}</span><br>${q.q}
          </div>
          <div class="quiz-opts">
            ${q.opts.map((opt, j) => `
              <button class="quiz-opt" data-q="${i}" data-o="${j}" data-key="${key}"
                onclick="selectOpt(this,${i},${j},'${key}')"
                style="display:block;width:100%;text-align:left;padding:9px 14px;margin-bottom:6px;
                       border:1.5px solid #e5e7eb;border-radius:8px;background:#f9fafb;
                       font-size:13px;cursor:pointer;transition:all .15s;font-family:inherit;color:#374151">
                <span style="font-weight:600;color:var(--accent);margin-right:6px">${String.fromCharCode(65+j)}.</span>${opt}
              </button>`).join('')}
          </div>
          <div class="quiz-exp" id="exp-${key}-${i}"
               style="display:none;margin-top:.85rem;padding:.85rem 1rem;border-radius:8px;font-size:13px;line-height:1.65"></div>
        </div>`).join('')}
    </div>
    <div id="quiz-result-${key}" style="display:none;text-align:center;padding:1.5rem;border-radius:12px;margin-top:.5rem"></div>
  `;
}

function selectOpt(btn, qIdx, oIdx, key) {
  const qBox = document.getElementById(`qq-${key}-${qIdx}`);
  if (qBox.dataset.answered) return;
  qBox.dataset.answered = '1';

  const q = QUIZZES[key][qIdx];
  const correct = oIdx === q.ans;
  const opts = qBox.querySelectorAll('.quiz-opt');

  opts.forEach((b, j) => {
    b.disabled = true;
    b.style.cursor = 'default';
    if (j === q.ans) {
      b.style.background = '#f0fdf4';
      b.style.borderColor = '#86efac';
      b.style.color = '#14532d';
    } else if (j === oIdx && !correct) {
      b.style.background = '#fef2f2';
      b.style.borderColor = '#fca5a5';
      b.style.color = '#7f1d1d';
    }
  });

  const expEl = document.getElementById(`exp-${key}-${qIdx}`);
  expEl.style.display = 'block';
  if (correct) {
    expEl.style.background = '#f0fdf4';
    expEl.style.borderLeft = '3px solid #22c55e';
    expEl.innerHTML = `<strong>✅ ¡Correcto!</strong> ${q.exp}`;
    if (!qBox.dataset.counted) { qBox.dataset.counted='1'; updateScore(key, true); }
  } else {
    expEl.style.background = '#fef2f2';
    expEl.style.borderLeft = '3px solid #ef4444';
    expEl.innerHTML = `<strong>❌ Incorrecto.</strong> ${q.exp}`;
    if (!qBox.dataset.counted) { qBox.dataset.counted='1'; updateScore(key, false); }
  }
}

const _scores = {};
function updateScore(key, correct) {
  if (!_scores[key]) _scores[key] = {score:0, answered:0};
  _scores[key].answered++;
  if (correct) _scores[key].score++;
  const {score, answered} = _scores[key];
  const total = QUIZZES[key].length;
  const pct = Math.round(answered/total*100);
  document.getElementById(`quiz-progress-${key}`).style.width = pct+'%';
  document.getElementById(`quiz-score-${key}`).textContent = `${answered} / ${total} respondidas · ${score} correctas`;
  if (answered === total) showFinalResult(key, score, total);
}

function showFinalResult(key, score, total) {
  const pct = Math.round(score/total*100);
  const el = document.getElementById(`quiz-result-${key}`);
  let msg, bg, emoji;
  if(pct>=85){emoji='🏆';msg='¡Excelente dominio del tema!';bg='linear-gradient(135deg,#064e3b,#0F6E56)'}
  else if(pct>=60){emoji='👍';msg='Buen trabajo. Repasa las respuestas incorrectas.';bg='linear-gradient(135deg,#1e3a5f,#378ADD)'}
  else{emoji='📚';msg='Te recomendamos revisar la sección antes de continuar.';bg='linear-gradient(135deg,#450a0a,#A32D2D)'}
  el.style.display='block';
  el.style.background=bg;
  el.style.color='white';
  el.innerHTML=`
    <div style="font-size:3rem;margin-bottom:.5rem">${emoji}</div>
    <div style="font-size:1.8rem;font-weight:800;margin-bottom:.3rem">${score} / ${total}</div>
    <div style="font-size:1rem;font-weight:600;margin-bottom:.25rem">${pct}% correcto</div>
    <div style="font-size:14px;opacity:.9;margin-bottom:1.25rem">${msg}</div>
    <button onclick="resetQuiz('${key}')"
      style="background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);
             color:white;padding:8px 20px;border-radius:999px;cursor:pointer;
             font-size:13px;font-weight:600;font-family:inherit">
      🔄 Repetir quiz
    </button>`;
}

function resetQuiz(key) {
  _scores[key] = {score:0, answered:0};
  const containerId = `quiz-container-${key}`;
  renderQuiz(key, containerId);
}

/* ── COPY CODE BUTTONS ── */
function addCopyButtons() {
  document.querySelectorAll('.fm').forEach(block => {
    if (block.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '📋 Copiar';
    btn.style.cssText = `
      position:absolute;top:8px;right:8px;
      background:#378ADD;color:white;border:none;
      padding:4px 10px;border-radius:6px;font-size:11px;
      cursor:pointer;font-family:inherit;font-weight:600;
      transition:background .2s;`;
    btn.onclick = () => {
      navigator.clipboard.writeText(block.textContent.replace('📋 Copiar','').trim());
      btn.innerHTML = '✅ Copiado';
      setTimeout(()=>btn.innerHTML='📋 Copiar', 1800);
    };
    block.style.position = 'relative';
    block.appendChild(btn);
  });
}

/* ── READING PROGRESS per page ── */
function initReadingProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = Math.min(pct,100) + '%';
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  addCopyButtons();
  initReadingProgress();
  // Observe .fm blocks added later
  new MutationObserver(addCopyButtons).observe(document.body, {childList:true,subtree:true});
});
