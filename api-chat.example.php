<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$apiKey = getenv('GROQ_API_KEY');
if (!$apiKey) {
    http_response_code(503);
    echo json_encode(['error' => 'Live AI is not configured']);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    http_response_code(413);
    echo json_encode(['error' => 'Request too large']);
    exit;
}

$input = json_decode($raw, true);
$message = trim((string)($input['message'] ?? ''));
$language = preg_replace('/[^a-z-]/i', '', (string)($input['language'] ?? 'en'));
if ($message === '' || mb_strlen($message) > 3000) {
    http_response_code(422);
    echo json_encode(['error' => 'A valid message is required']);
    exit;
}

$messages = [[
    'role' => 'system',
    'content' => "You are AccessBridge AI. Give concise, accessible, practical guidance in language code {$language}. Never request passwords, OTPs, financial data, government identifiers, or medical records. Clearly advise users to verify important information on official websites. Do not invent official links."
]];

foreach (array_slice((array)($input['history'] ?? []), -8) as $item) {
    $role = ($item['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $content = trim((string)($item['content'] ?? ''));
    if ($content !== '') $messages[] = ['role' => $role, 'content' => mb_substr($content, 0, 3000)];
}
$messages[] = ['role' => 'user', 'content' => $message];

$payload = json_encode([
    'model' => getenv('GROQ_MODEL') ?: 'llama-3.3-70b-versatile',
    'messages' => $messages,
    'temperature' => 0.35,
    'max_tokens' => 900,
]);

$curl = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);
$response = curl_exec($curl);
$status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

$decoded = json_decode((string)$response, true);
$answer = trim((string)($decoded['choices'][0]['message']['content'] ?? ''));
if ($status < 200 || $status >= 300 || $answer === '') {
    http_response_code(502);
    echo json_encode(['error' => 'AI service unavailable']);
    exit;
}

echo json_encode(['answer' => $answer], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

