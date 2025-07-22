import InputField from '@/components/shared/InputField';

export default function CodeForm({ code, setCode }: { code: string, setCode: (code: string) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <InputField
                label="인증 코드"
                type="text"
                id="code"
                placeholder='인증 코드를 입력해주세요'
                disabled={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
        </div>
    );
}
