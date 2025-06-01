import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Help() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Справка</h2>
            <Card>
                <CardHeader className="hidden">
                    <CardTitle>Руководство пользователя</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">
                                Как подать заявку на организацию события?
                            </AccordionTrigger>
                            <AccordionContent className="text-lg">
                                1. Перейдите в раздел &quot;События&quot;.
                                <br />
                                2. Нажмите кнопку &quot;Создать новое событие&quot;.
                                <br />
                                3. Заполните все необходимые поля.
                                <br />
                                4. Выберите как будет проходить событие.
                                <br />
                                5. Если событие не будет онлайн - обязательно укажите место проведения и адрес.
                                <br />В данном случае - место проведения является объектом, на котором будут проходить
                                соревнования.
                                <br />
                                6. Укажите спортивные дисциплины, если вы уже строго знаете что будете проводить.
                                <br />
                                7. Нажмите &quot;Создать событие&quot;.
                                <br />
                                8. Ожидайте принятия решения центрального отдела ФСП.
                                <br />
                                9. Не забывайте проверять вкладку &quot;Уведомления&quot;, чтобы узнать о решение
                                центрального отдела.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">
                                Как просмотреть какие файлы результатов есть у события?
                            </AccordionTrigger>
                            <AccordionContent className="text-lg">
                                1. Перейдите в раздел &quot;События&quot;.
                                <br />
                                2. Изучите все свои события.
                                <br />
                                3. Выберите событие из списка, у которого в поле &quot;Статус&quot; написано
                                &quot;Одобрено&quot;.
                                <br />
                                4. В открывшемся диалоговом окне вы увидите раздел &quot;Файлы&quot;
                                <br />
                                5. В данном окне автоматически выбрана секция &quot;Загруженные файлы&quot;
                                <br />
                                6. В данной секции отображается вся информация о файлах результатов, которые прикреплены
                                к событию.
                                <br />
                                7. Если файлов в секции нет - то к событию не прикреплено никаких результатов.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg">
                                Как просмотреть файлы результатов соревнований?
                            </AccordionTrigger>
                            <AccordionContent className="text-lg">
                                1. Перейдите в раздел &quot;События&quot;.
                                <br />
                                2. Изучите все свои события.
                                <br />
                                3. Выберите событие из списка, у которого в поле &quot;Статус&quot; написано
                                &quot;Одобрено&quot;.
                                <br />
                                4. В открывшемся диалоговом окне вы увидите раздел &quot;Файлы&quot;
                                <br />
                                5. В данном окне автоматически выбрана секция &quot;Загруженные файлы&quot;
                                <br />
                                6. В данной секции выберите интересующий вас файл и нажмите кнопку с правого края
                                &quot;Просмотр PDF&quot;
                                <br />
                                7. После нажатия на кнопку откроется диалоговое окно, в котором отобразится файл.
                                <br />
                                8. Для закрытия файла нажмите &quot;X&quot; в верхнем правом углу диалогового окна.
                                <br />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-lg">Как загрузить результаты событий?</AccordionTrigger>
                            <AccordionContent className="text-lg">
                                1. Перейдите в раздел &quot;События&quot;.
                                <br />
                                2. Изучите все свои события.
                                <br />
                                3. Выберите событие из списка, у которого в поле &quot;Статус&quot; написано
                                &quot;Одобрено&quot;.
                                <br />
                                4. В открывшемся диалоговом окне в разделе &quot;Файлы&quot; выберите пункт
                                &quot;Добавить файлы&quot;.
                                <br />
                                5. Нажмите на секцию загрузки файлов, либо перетащите в неё файлы.
                                <br />
                                6. После загрузки файлов нажмите кнопку &quot;Подтвердить загрузку&quot;. При
                                необходимости пролистайте страницу вниз.
                                <br />
                                7. Как файлы будут загружены - окно автоматически будет закрыто.
                                <br />
                                8. Для отображения файлов в информации о событии необходимо подождать. <br />
                                <br /> <strong>Совет: </strong> для более быстрой загрузки файлов результатов
                                рекомендуется не нагружать страницу и посмотреть другие разделы сайта.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="text-lg">Как обновить информацию в профиле?</AccordionTrigger>
                            <AccordionContent className="text-lg">
                                1. Перейдите в раздел &quot;Профиль&quot;
                                <br />
                                2. Дождитесь загрузки информации о своем профиле
                                <br />
                                3. Нажмите кнопку &quot;Редактировать&quot;
                                <br />
                                4. Внесите необходимые изменения в профиль
                                <br />
                                5. Нажмите кнопку &quot;Сохранить изменения&quot;
                                <br />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
